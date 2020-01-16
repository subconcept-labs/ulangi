/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorCode, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { VocabularyModel } from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import { Task } from 'redux-saga';
import {
  CallEffect,
  all,
  call,
  cancel,
  fork,
  put,
  take,
} from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { RandomRangeIterator } from '../iterators/RandomRangeIterator';
import { ProtectedSaga } from './ProtectedSaga';

export class AtomSaga extends ProtectedSaga {
  private fetchTask?: Task;

  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;

  public constructor(userDb: SQLiteDatabase, vocabularyModel: VocabularyModel) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowPrepareAndClearFetchVocabulary],
      config.atom.minToPlay,
      config.atom.fetchLimit
    );
  }

  public *allowPrepareAndClearFetchVocabulary(
    minToPlay: number,
    limit: number
  ): IterableIterator<any> {
    this.fetchTask = yield fork(
      [this, this.allowPrepareFetchVocabulary],
      minToPlay,
      limit
    );
    yield fork([this, this.allowClearFetchVocabulary], minToPlay, limit);
  }

  private *allowClearFetchVocabulary(
    minToPlay: number,
    limit: number
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.ATOM__CLEAR_FETCH_VOCABULARY);
      if (typeof this.fetchTask !== 'undefined') {
        yield cancel(this.fetchTask);
      }

      this.fetchTask = yield fork(
        [this, this.allowPrepareFetchVocabulary],
        minToPlay,
        limit
      );
    }
  }

  private *allowPrepareFetchVocabulary(
    minToPlay: number,
    limit: number
  ): IterableIterator<any> {
    try {
      const action: Action<
        ActionType.ATOM__PREPARE_FETCH_VOCABULARY
      > = yield take(ActionType.ATOM__PREPARE_FETCH_VOCABULARY);

      const { setId, selectedCategoryNames } = action.payload;

      yield put(
        createAction(ActionType.ATOM__PREPARING_FETCH_VOCABULARY, null)
      );

      const initialRange: PromiseType<
        ReturnType<VocabularyModel['getVocabularyRange']>
      > = yield call(
        [this.vocabularyModel, 'getVocabularyRange'],
        this.userDb,
        setId
      );

      if (initialRange !== null) {
        const randomRangeIterator = new RandomRangeIterator();
        randomRangeIterator.setInitialRange(initialRange);

        yield fork(
          [this, this.allowFetchVocabulary],
          minToPlay,
          limit,
          setId,
          selectedCategoryNames,
          randomRangeIterator
        );

        yield put(
          createAction(
            ActionType.ATOM__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
            null
          )
        );
      } else {
        throw new Error(ErrorCode.ATOM__INSUFFICIENT_VOCABULARY);
      }
    } catch (error) {
      yield put(
        createAction(ActionType.ATOM__PREPARE_FETCH_VOCABULARY_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
    }
  }

  private *allowFetchVocabulary(
    minToPlay: number,
    limit: number,
    setId: string,
    selectedCategoryNames: undefined | string[],
    randomRangeIterator: RandomRangeIterator
  ): IterableIterator<any> {
    let done = false;
    while (done === false) {
      yield take(ActionType.ATOM__FETCH_VOCABULARY);

      try {
        yield put(createAction(ActionType.ATOM__FETCHING_VOCABULARY, null));

        let vocabularyList: Vocabulary[] = [];
        let counter = 0;
        while (vocabularyList.length < limit && done === false) {
          const remaining = limit - vocabularyList.length;
          const result = randomRangeIterator.next(remaining);
          const ranges = result.value;

          const results: PromiseType<
            ReturnType<VocabularyModel['getVocabularyBetweenRange']>
          >[] = yield all(
            ranges.map(
              ([startRange, endRange]): CallEffect => {
                return call(
                  [this.vocabularyModel, 'getVocabularyBetweenRange'],
                  this.userDb,
                  setId,
                  VocabularyStatus.ACTIVE,
                  selectedCategoryNames,
                  startRange,
                  endRange,
                  true
                );
              }
            )
          );

          // Filter null result
          const filtered = results.filter(
            (
              result
            ): result is {
              vocabularyLocalIdPair: [Vocabulary, number];
            } => result !== null
          );

          // Extract local ids
          const fetchedLocalIds = filtered.map(
            (result): number => {
              return result.vocabularyLocalIdPair[1];
            }
          );

          fetchedLocalIds.forEach(
            (id): void => {
              randomRangeIterator.removeOrShortenRangeFromLeft(id);
            }
          );

          // Filter out ranges that do not return any vocabulary
          const emptyRanges = ranges.filter(
            (range): boolean => {
              return (
                fetchedLocalIds.filter(
                  (id): boolean => id >= range[0] && id <= range[1]
                ).length === 0
              );
            }
          );

          emptyRanges.forEach(
            (range): void => {
              randomRangeIterator.removeExactRange(range);
            }
          );

          // Filter out vocabulary that does not have any definitions
          vocabularyList = vocabularyList.concat(
            filtered
              .map(
                (result): Vocabulary => {
                  return result.vocabularyLocalIdPair[0];
                }
              )
              .filter(
                (vocabulary): boolean => {
                  return vocabulary.definitions.length !== 0;
                }
              )
          );

          vocabularyList = _.shuffle(vocabularyList);

          done = randomRangeIterator.isDone();
          counter += vocabularyList.length;
        }

        if (counter < minToPlay) {
          throw new Error(ErrorCode.ATOM__INSUFFICIENT_VOCABULARY);
        } else {
          yield put(
            createAction(ActionType.ATOM__FETCH_VOCABULARY_SUCCEEDED, {
              vocabularyList,
              noMore: done,
            })
          );
        }
      } catch (error) {
        yield put(
          createAction(ActionType.ATOM__FETCH_VOCABULARY_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
