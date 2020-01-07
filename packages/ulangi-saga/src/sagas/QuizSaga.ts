/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorCode } from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  QuizMultipleChoiceModel,
  QuizWritingModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import { CallEffect, all, call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { RandomRangeIterator } from '../iterators/RandomRangeIterator';
import { ProtectedSaga } from './ProtectedSaga';

export class QuizSaga extends ProtectedSaga {
  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;
  private quizMultipleChoiceModel: QuizMultipleChoiceModel;
  private quizWritingModel: QuizWritingModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    vocabularyModel: VocabularyModel,
    quizMultipleChoiceModel: QuizMultipleChoiceModel,
    quizWritingModel: QuizWritingModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
    this.quizMultipleChoiceModel = quizMultipleChoiceModel;
    this.quizWritingModel = quizWritingModel;
    this.crashlytics = crashlytics;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowFetchVocabularyForWriting],
      config.quiz.minPerWritingQuiz
    );
    yield fork(
      [this, this.allowFetchVocabularyForMultipleChoice],
      config.quiz.minPerMultipleChoiceQuiz
    );
  }

  public *allowFetchVocabularyForWriting(
    minPerQuiz: number
  ): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING
      > = yield take(ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING);
      const {
        setId,
        vocabularyPool,
        limit,
        selectedCategoryNames,
      } = action.payload;

      try {
        yield put(
          createAction(ActionType.QUIZ__FETCHING_VOCABULARY_FOR_WRITING, {
            setId,
          })
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
          let vocabularyList: Vocabulary[] = [];
          let done = false;

          while (vocabularyList.length < limit && done === false) {
            const remaining = limit - vocabularyList.length;
            const { value: ranges } = randomRangeIterator.next(remaining);

            const results: PromiseType<
              ReturnType<QuizWritingModel['getVocabularyForWritingQuiz']>
            >[] = yield all(
              ranges.map(
                ([startRange, endRange]): CallEffect => {
                  return call(
                    [this.quizWritingModel, 'getVocabularyForWritingQuiz'],
                    this.userDb,
                    setId,
                    vocabularyPool,
                    startRange,
                    endRange,
                    true,
                    selectedCategoryNames,
                    undefined
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
                return assertExists(result.vocabularyLocalIdPair[1]);
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
          }

          if (vocabularyList.length < minPerQuiz) {
            throw new Error(ErrorCode.QUIZ__INSUFFICIENT_VOCABULARY);
          } else {
            yield put(
              createAction(
                ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING_SUCCEEDED,
                {
                  setId,
                  vocabularyList,
                }
              )
            );
          }
        } else {
          throw new Error(ErrorCode.QUIZ__INSUFFICIENT_VOCABULARY);
        }
      } catch (error) {
        yield put(
          createAction(ActionType.QUIZ__FETCH_VOCABULARY_FOR_WRITING_FAILED, {
            setId,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowFetchVocabularyForMultipleChoice(
    minPerQuiz: number
  ): IterableIterator<any> {
    while (true) {
      const action: Action<
        ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE
      > = yield take(ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE);
      const {
        setId,
        vocabularyPool,
        limit,
        selectedCategoryNames,
      } = action.payload;

      try {
        yield put(
          createAction(
            ActionType.QUIZ__FETCHING_VOCABULARY_FOR_MULTIPLE_CHOICE,
            {
              setId,
            }
          )
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
          let vocabularyList: Vocabulary[] = [];
          let done = false;
          while (vocabularyList.length < limit && done === false) {
            const remaining = limit - vocabularyList.length;
            const result = randomRangeIterator.next(remaining);
            const ranges = result.value;

            const results: PromiseType<
              ReturnType<
                QuizMultipleChoiceModel['getVocabularyForMultipleChoiceQuiz']
              >
            >[] = yield all(
              ranges.map(
                ([startRange, endRange]): CallEffect => {
                  return call(
                    [
                      this.quizMultipleChoiceModel,
                      'getVocabularyForMultipleChoiceQuiz',
                    ],
                    this.userDb,
                    setId,
                    vocabularyPool,
                    startRange,
                    endRange,
                    true,
                    selectedCategoryNames,
                    undefined
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
                return assertExists(result.vocabularyLocalIdPair[1]);
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
          }

          if (vocabularyList.length < minPerQuiz) {
            throw new Error(ErrorCode.QUIZ__INSUFFICIENT_VOCABULARY);
          } else {
            yield put(
              createAction(
                ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE_SUCCEEDED,
                {
                  setId,
                  vocabularyList,
                }
              )
            );
          }
        } else {
          throw new Error(ErrorCode.QUIZ__INSUFFICIENT_VOCABULARY);
        }
      } catch (error) {
        yield put(
          createAction(
            ActionType.QUIZ__FETCH_VOCABULARY_FOR_MULTIPLE_CHOICE_FAILED,
            {
              setId,
              errorCode: this.crashlytics.getErrorCode(error),
            }
          )
        );
      }
    }
  }
}
