/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepMutable, DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { WritingScheduler } from '@ulangi/ulangi-common/core';
import { ErrorCode, VocabularyStatus } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  SessionModel,
  VocabularyModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ModSequenceStrategy } from '../strategies/ModSequenceStrategy';
import { ProtectedSaga } from './ProtectedSaga';

export class WritingSaga extends ProtectedSaga {
  private sequenceStrategy = new ModSequenceStrategy();
  private writingScheduler = new WritingScheduler();

  private sharedDb: SQLiteDatabase;
  private userDb: SQLiteDatabase;
  private sessionModel: SessionModel;
  private vocabularyModel: VocabularyModel;
  private writingModel: WritingModel;

  public constructor(
    sharedDb: SQLiteDatabase,
    userDb: SQLiteDatabase,
    sessionModel: SessionModel,
    vocabularyModel: VocabularyModel,
    writingModel: WritingModel
  ) {
    super();
    this.sharedDb = sharedDb;
    this.userDb = userDb;
    this.sessionModel = sessionModel;
    this.vocabularyModel = vocabularyModel;
    this.writingModel = writingModel;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowFetchVocabulary],
      config.writing.maxLevel,
      config.writing.minPerLesson
    );
    yield fork([this, this.allowSaveResult], config.writing.maxLevel);
  }

  public *allowFetchVocabulary(
    maxLevel: number,
    minPerLesson: number
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.WRITING__FETCH_VOCABULARY> = yield take(
        ActionType.WRITING__FETCH_VOCABULARY
      );
      const {
        setId,
        initialInterval,
        limit,
        selectedCategoryNames,
        includeFromOtherCategories,
      } = action.payload;

      try {
        yield put(
          createAction(ActionType.WRITING__FETCHING_VOCABULARY, { setId })
        );

        const termPosition = yield call(
          [this, this.getCurrentTermPosition],
          setId,
          maxLevel
        );

        const orderedLevels = this.sequenceStrategy.getLevelsByTermPosition(
          termPosition,
          maxLevel
        );

        const vocabularyList = yield call(
          [this, this.fetchVocabulary],
          setId,
          initialInterval,
          selectedCategoryNames,
          undefined,
          orderedLevels,
          limit
        );

        if (
          vocabularyList.length < minPerLesson &&
          typeof selectedCategoryNames !== 'undefined' &&
          includeFromOtherCategories === true
        ) {
          const newList = yield call(
            [this, this.fetchVocabulary],
            setId,
            initialInterval,
            undefined,
            selectedCategoryNames,
            orderedLevels,
            limit
          );
          vocabularyList.push(...newList);
        }

        if (vocabularyList.length < minPerLesson) {
          throw new Error(ErrorCode.WRITING__INSUFFICIENT_VOCABULARY);
        } else {
          yield put(
            createAction(ActionType.WRITING__FETCH_VOCABULARY_SUCCEEDED, {
              setId,
              vocabularyList,
            })
          );
        }
      } catch (error) {
        yield put(
          createAction(ActionType.WRITING__FETCH_VOCABULARY_FAILED, {
            setId,
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowSaveResult(maxLevel: number): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.WRITING__SAVE_RESULT> = yield take(
        ActionType.WRITING__SAVE_RESULT
      );
      const {
        setId,
        vocabularyList,
        feedbackList,
        autoArchiveSettings,
        incrementTermPosition,
      } = action.payload;

      try {
        yield put(createAction(ActionType.WRITING__SAVING_RESULT, null));

        const editedVocabularyList = Array.from(feedbackList.entries()).map(
          ([vocabularyId, feedback]): DeepPartial<Vocabulary> => {
            const vocabulary = assertExists(vocabularyList.get(vocabularyId));

            const editedVocabulary: DeepMutable<DeepPartial<Vocabulary>> = {
              vocabularyId: vocabulary.vocabularyId,
              writing: {
                lastWrittenAt: moment().toDate(),
                level: this.writingScheduler.getNextLevel(
                  vocabulary,
                  feedback,
                  maxLevel
                ),
              },
            };

            if (
              this.writingScheduler.willBeArchived(
                vocabulary,
                feedback,
                maxLevel,
                autoArchiveSettings
              )
            ) {
              editedVocabulary.vocabularyStatus = VocabularyStatus.ARCHIVED;
            }
            return editedVocabulary;
          }
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.vocabularyModel.updateMultipleVocabulary(
              tx,
              editedVocabularyList.map(
                (vocabulary): [DeepPartial<Vocabulary>, undefined] => [
                  vocabulary,
                  undefined,
                ]
              ),
              'local'
            );
          }
        );

        if (incrementTermPosition === true) {
          yield call([this, this.incrementTermPosition], setId, maxLevel);
        }

        yield put(
          createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.WRITING__SAVE_RESULT_FAILED, {
            error,
            errorCode: errorConverter.getErrorCode(error),
          })
        );
      }
    }
  }

  private *fetchVocabulary(
    setId: string,
    initialInterval: number,
    selectedCategoryNames: undefined | string[],
    excludedCategoryNames: undefined | string[],
    orderedLevel: readonly number[],
    limit: number
  ): IterableIterator<any> {
    let vocabularyList: Vocabulary[] = [];

    const levels = orderedLevel.slice();
    // Fetch vocabulary by each level until the limit is reached

    while (levels.length > 0 && vocabularyList.length < limit) {
      const currentLevel = assertExists(levels.shift());
      const remain = limit - vocabularyList.length;

      const result: PromiseType<
        ReturnType<WritingModel['getDueVocabularyList']>
      > = yield call(
        [this.writingModel, 'getDueVocabularyListByLevel'],
        this.userDb,
        setId,
        currentLevel,
        initialInterval,
        remain,
        true,
        selectedCategoryNames,
        excludedCategoryNames
      );

      let { vocabularyList: newList } = result;

      // Filter out vocabulary that does not have any definitions
      newList = newList.filter(
        (vocabulary: Vocabulary): boolean => vocabulary.definitions.length !== 0
      );

      vocabularyList = vocabularyList.concat(newList);
    }

    return vocabularyList;
  }

  private *getCurrentTermPosition(
    setId: string,
    maxLevel: number
  ): IterableIterator<any> {
    const termPosition: PromiseType<
      ReturnType<SessionModel['getWritingTermPosition']>
    > = yield call(
      [this.sessionModel, 'getWritingTermPosition'],
      this.sharedDb,
      setId
    );
    return termPosition === null ? _.random(0, maxLevel - 1) : termPosition;
  }

  private *incrementTermPosition(
    setId: string,
    maxLevel: number
  ): IterableIterator<any> {
    const termPosition = yield call(
      [this, this.getCurrentTermPosition],
      setId,
      maxLevel
    );

    const nextTermPosition = (termPosition + 1) % maxLevel;

    yield call(
      [this.sharedDb, 'transaction'],
      (tx: Transaction): void => {
        this.sessionModel.upsertWritingTermPosition(
          tx,
          setId,
          nextTermPosition
        );
      }
    );
  }
}
