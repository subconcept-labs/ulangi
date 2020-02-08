/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  DefinitionBuilder,
  VocabularyBuilder,
} from '@ulangi/ulangi-common/builders';
import {
  ErrorCode,
  Feedback,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  SpacedRepetitionModel,
  VocabularyModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { LevelSequenceStrategy } from '../strategies/LevelSequenceStrategy';
import { SpacedRepetitionSaga } from './SpacedRepetitionSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  VocabularyModel: VocabularyModelMock,
  SpacedRepetitionModel: SpacedRepetitionModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('SpacedRepetitionSaga', (): void => {
  describe('Test starts with all mocked modules', (): void => {
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedSpacedRepetitionModel: jest.Mocked<SpacedRepetitionModel>;
    let spacedRepetitionSaga: SpacedRepetitionSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedVocabularyModel = new VocabularyModelMock();
        mockedSpacedRepetitionModel = new SpacedRepetitionModelMock();

        spacedRepetitionSaga = new SpacedRepetitionSaga(
          mockedUserDatabase,
          mockedVocabularyModel,
          mockedSpacedRepetitionModel
        );
      }
    );

    describe('Test allowFetchVocabulary with minPerLesson = 3', (): void => {
      const minPerLesson = 3;

      beforeEach(
        (): void => {
          saga = expectSaga(
            spacedRepetitionSaga.allowFetchVocabulary.bind(
              spacedRepetitionSaga
            ),
            minPerLesson
          );
        }
      );

      describe('Tests with includeFromOtherCategories = false', (): void => {
        const includeFromOtherCategories = false;

        test('fetch vocabulary list successfully if vocabulary are returned from database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 10;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(10)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  definitions: [new DefinitionBuilder().build({})],
                });
              }
            );

          let levels = new LevelSequenceStrategy().getLevelSequence(
            'PRIORITIZE_LEARNED_TERMS'
          );

          await saga
            .provide([
              [
                matchers.call.fn(
                  mockedSpacedRepetitionModel.getDueVocabularyListByLevel
                ),
                { vocabularyList },
              ],
            ])
            .dispatch(
              createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
                setId,
              })
            )
            .call(
              [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
              mockedUserDatabase,
              setId,
              _.first(levels),
              initialInterval,
              limit,
              true,
              selectedCategoryNames,
              undefined
            )
            .put(
              createAction(
                ActionType.SPACED_REPETITION__FETCH_VOCABULARY_SUCCEEDED,
                {
                  setId,
                  vocabularyList,
                }
              )
            )
            .silentRun();
        });

        test('fetch vocabulary list successfully if there are a total of 3 vocabulary are returned from the database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 10;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(3)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  definitions: [new DefinitionBuilder().build({})],
                });
              }
            );

          let levels = new LevelSequenceStrategy().getLevelSequence(
            'PRIORITIZE_LEARNED_TERMS'
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn ===
                  mockedSpacedRepetitionModel.getDueVocabularyListByLevel
                ) {
                  const level = effect.args[2];
                  // Only the last level return non-empty vocabularyList
                  if (level !== _.last(levels)) {
                    return { vocabularyList: [] };
                  } else {
                    return { vocabularyList };
                  }
                }

                return next();
              },
            })
            .dispatch(
              createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
                setId,
              })
            );

          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                selectedCategoryNames,
                undefined
              );
            }
          );

          await saga
            .put(
              createAction(
                ActionType.SPACED_REPETITION__FETCH_VOCABULARY_SUCCEEDED,
                {
                  setId,
                  vocabularyList,
                }
              )
            )
            .silentRun();
        });

        test('return INSUFFICIENT_VOCABULARY error if 2 vocabulary are returned from the database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 10;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(2)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  definitions: [new DefinitionBuilder().build({})],
                });
              }
            );

          let levels = new LevelSequenceStrategy().getLevelSequence(
            'PRIORITIZE_LEARNED_TERMS'
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn ===
                  mockedSpacedRepetitionModel.getDueVocabularyListByLevel
                ) {
                  const level = effect.args[2];
                  if (level !== _.last(levels)) {
                    return { vocabularyList: [] };
                  } else {
                    return { vocabularyList };
                  }
                }

                return next();
              },
            })
            .dispatch(
              createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                selectedCategoryNames,
                limit,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
                setId,
              })
            );

          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                selectedCategoryNames,
                undefined
              );
            }
          );

          await saga
            .put(
              createAction(
                ActionType.SPACED_REPETITION__FETCH_VOCABULARY_FAILED,
                {
                  setId,
                  errorCode:
                    ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY,
                  error: ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY,
                }
              )
            )
            .silentRun();
        });

        test('return INSUFFICIENT_VOCABULARY error if 3 vocabulary with empty definitions are returned from the database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 10;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(3)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({});
              }
            );

          let levels = new LevelSequenceStrategy().getLevelSequence(
            'PRIORITIZE_LEARNED_TERMS'
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn ===
                  mockedSpacedRepetitionModel.getDueVocabularyListByLevel
                ) {
                  const level = effect.args[2];
                  if (level !== _.last(levels)) {
                    return { vocabularyList: [] };
                  } else {
                    return { vocabularyList };
                  }
                }

                return next();
              },
            })
            .dispatch(
              createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
                setId,
              })
            );

          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                selectedCategoryNames,
                undefined
              );
            }
          );

          await saga
            .put(
              createAction(
                ActionType.SPACED_REPETITION__FETCH_VOCABULARY_FAILED,
                {
                  setId,
                  errorCode:
                    ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY,
                  error: ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY,
                }
              )
            )
            .silentRun();
        });
      });

      describe('Test with includeFromOtherCategories = true', (): void => {
        const includeFromOtherCategories = true;

        test('fetch successfully when including terms from other categories', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 10;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(2)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  definitions: [new DefinitionBuilder().build({})],
                });
              }
            );

          let levels = new LevelSequenceStrategy().getLevelSequence(
            'PRIORITIZE_LEARNED_TERMS'
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn ===
                  mockedSpacedRepetitionModel.getDueVocabularyListByLevel
                ) {
                  const level = effect.args[2];
                  // Only the last level return non-empty vocabularyList
                  if (level !== _.last(levels)) {
                    return { vocabularyList: [] };
                  } else {
                    return { vocabularyList };
                  }
                }

                return next();
              },
            })
            .dispatch(
              createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
                setId,
              })
            );

          // First time fetch with selectedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                selectedCategoryNames,
                undefined
              );
            }
          );

          // Second time fetch with excludedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                selectedCategoryNames
              );
            }
          );

          await saga
            .put(
              createAction(
                ActionType.SPACED_REPETITION__FETCH_VOCABULARY_SUCCEEDED,
                {
                  setId,
                  vocabularyList: [...vocabularyList, ...vocabularyList],
                }
              )
            )
            .silentRun();
        });

        test('return INSUFFICIENT_VOCABULARY when including terms from other categories', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 10;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(1)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  definitions: [new DefinitionBuilder().build({})],
                });
              }
            );

          let levels = new LevelSequenceStrategy().getLevelSequence(
            'PRIORITIZE_LEARNED_TERMS'
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn ===
                  mockedSpacedRepetitionModel.getDueVocabularyListByLevel
                ) {
                  const level = effect.args[2];
                  // Only the last level return non-empty vocabularyList
                  if (level !== _.last(levels)) {
                    return { vocabularyList: [] };
                  } else {
                    return { vocabularyList };
                  }
                }

                return next();
              },
            })
            .dispatch(
              createAction(ActionType.SPACED_REPETITION__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.SPACED_REPETITION__FETCHING_VOCABULARY, {
                setId,
              })
            );

          // First time fetch with selectedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                selectedCategoryNames,
                undefined
              );
            }
          );

          // Second time fetch with excludedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedSpacedRepetitionModel, 'getDueVocabularyListByLevel'],
                mockedUserDatabase,
                setId,
                level,
                initialInterval,
                limit,
                true,
                undefined,
                selectedCategoryNames
              );
            }
          );

          await saga
            .put(
              createAction(
                ActionType.SPACED_REPETITION__FETCH_VOCABULARY_FAILED,
                {
                  setId,
                  errorCode:
                    ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY,
                  error: ErrorCode.SPACED_REPETITION__INSUFFICIENT_VOCABULARY,
                }
              )
            )
            .silentRun();
        });
      });
    });

    describe('Test allowSaveResult with maxLevel = 10', (): void => {
      let vocabularyList: Vocabulary[];
      const maxLevel = 10;

      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          saga = expectSaga(
            spacedRepetitionSaga.allowSaveResult.bind(spacedRepetitionSaga),
            maxLevel
          );
          vocabularyList = Array(5)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({ level: 5 });
              }
            );

          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('update levels correctly based on feedback', async (): Promise<
        void
      > => {
        const feedbackList = new Map([
          [vocabularyList[0].vocabularyId, Feedback.POOR],
          [vocabularyList[1].vocabularyId, Feedback.FAIR],
          [vocabularyList[2].vocabularyId, Feedback.GOOD],
          [vocabularyList[3].vocabularyId, Feedback.GREAT],
          [vocabularyList[4].vocabularyId, Feedback.SUPERB],
        ]);

        await saga
          .dispatch(
            createAction(ActionType.SPACED_REPETITION__SAVE_RESULT, {
              vocabularyList: new Map(
                vocabularyList.map(
                  (vocabulary): [string, Vocabulary] => [
                    vocabulary.vocabularyId,
                    vocabulary,
                  ]
                )
              ),
              feedbackList,
              autoArchiveSettings: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 0,
              },
            })
          )
          .put(createAction(ActionType.SPACED_REPETITION__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(
              ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
              null
            )
          )
          .silentRun();

        const lastLearnedAt = moment().toDate();
        const expectedResults = [
          {
            vocabularyId: vocabularyList[0].vocabularyId,
            lastLearnedAt,
            level: 1,
          },
          {
            vocabularyId: vocabularyList[1].vocabularyId,
            lastLearnedAt,
            level: 3,
          },
          {
            vocabularyId: vocabularyList[2].vocabularyId,
            lastLearnedAt,
            level: 6,
          },
          {
            vocabularyId: vocabularyList[3].vocabularyId,
            lastLearnedAt,
            level: 7,
          },
          {
            vocabularyId: vocabularyList[4].vocabularyId,
            lastLearnedAt,
            level: 8,
          },
        ];
        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (vocabulary): [DeepPartial<Vocabulary>, undefined] => [
              vocabulary,
              undefined,
            ]
          ),
          'local'
        );
      });

      test('archive vocabulary based on vocabulary level', async (): Promise<
        void
      > => {
        const feedbackList = new Map([
          [vocabularyList[0].vocabularyId, Feedback.POOR],
          [vocabularyList[1].vocabularyId, Feedback.FAIR],
          [vocabularyList[2].vocabularyId, Feedback.GOOD],
          [vocabularyList[3].vocabularyId, Feedback.GREAT],
          [vocabularyList[4].vocabularyId, Feedback.SUPERB],
        ]);

        await saga
          .dispatch(
            createAction(ActionType.SPACED_REPETITION__SAVE_RESULT, {
              vocabularyList: new Map(
                vocabularyList.map(
                  (vocabulary): [string, Vocabulary] => [
                    vocabulary.vocabularyId,
                    vocabulary,
                  ]
                )
              ),
              feedbackList,
              autoArchiveSettings: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 6,
                writingLevelThreshold: 0,
              },
            })
          )
          .put(createAction(ActionType.SPACED_REPETITION__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(
              ActionType.SPACED_REPETITION__SAVE_RESULT_SUCCEEDED,
              null
            )
          )
          .silentRun();

        const lastLearnedAt = moment().toDate();
        const expectedResults = [
          {
            vocabularyId: vocabularyList[0].vocabularyId,
            lastLearnedAt,
            level: 1,
          },
          {
            vocabularyId: vocabularyList[1].vocabularyId,
            lastLearnedAt,
            level: 3,
          },
          {
            vocabularyId: vocabularyList[2].vocabularyId,
            lastLearnedAt,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
            level: 6,
          },
          {
            vocabularyId: vocabularyList[3].vocabularyId,
            lastLearnedAt,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
            level: 7,
          },
          {
            vocabularyId: vocabularyList[4].vocabularyId,
            lastLearnedAt,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
            level: 8,
          },
        ];
        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (vocabulary): [DeepPartial<Vocabulary>, undefined] => [
              vocabulary,
              undefined,
            ]
          ),
          'local'
        );
      });
    });
  });
});
