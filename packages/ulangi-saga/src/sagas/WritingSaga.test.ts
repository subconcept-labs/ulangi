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
  SessionModel,
  VocabularyModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { ModSequenceStrategy } from '../strategies/ModSequenceStrategy';
import { WritingSaga } from './WritingSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  VocabularyModel: VocabularyModelMock,
  WritingModel: WritingModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('WritingSaga', (): void => {
  describe('Test starts with all mocked modules', (): void => {
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedWritingModel: jest.Mocked<WritingModel>;
    let writingSaga: WritingSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedVocabularyModel = new VocabularyModelMock();
        mockedWritingModel = new WritingModelMock();

        writingSaga = new WritingSaga(
          mockedSharedDatabase,
          mockedUserDatabase,
          mockedSessionModel,
          mockedVocabularyModel,
          mockedWritingModel
        );
      }
    );

    describe('Test allowFetchVocabulary with maxLevel = 10, minPerLesson = 3', (): void => {
      const maxLevel = 10;
      const minPerLesson = 3;

      beforeEach(
        (): void => {
          saga = expectSaga(
            writingSaga.allowFetchVocabulary.bind(writingSaga),
            maxLevel,
            minPerLesson
          );
        }
      );

      describe('Tests with includeFromOtherCategories = false', (): void => {
        const includeFromOtherCategories = false;

        test('fetch vocabulary list successfully if vocabulary is returned from database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 5;
          const termPosition = 5;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(limit)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  definitions: [new DefinitionBuilder().build({})],
                });
              }
            );

          const levels = new ModSequenceStrategy().getLevelsByTermPosition(
            termPosition,
            maxLevel
          );

          await saga
            .provide([
              [
                matchers.call.fn(mockedSessionModel.getWritingTermPosition),
                termPosition,
              ],
              [
                matchers.call.fn(
                  mockedWritingModel.getDueVocabularyListByLevel
                ),
                { vocabularyList },
              ],
            ])
            .dispatch(
              createAction(ActionType.WRITING__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.WRITING__FETCHING_VOCABULARY, { setId })
            )
            .call(
              [mockedWritingModel, 'getDueVocabularyListByLevel'],
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY_SUCCEEDED, {
                setId,
                vocabularyList,
              })
            )
            .silentRun();
        });

        test('fetch vocabulary list successfully if there are a total of 3 vocabulary are returned from the database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 5;
          const termPosition = 0;
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

          let levels = new ModSequenceStrategy().getLevelsByTermPosition(
            termPosition,
            maxLevel
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn === mockedWritingModel.getDueVocabularyListByLevel
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.WRITING__FETCHING_VOCABULARY, { setId })
            );

          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY_SUCCEEDED, {
                setId,
                vocabularyList,
              })
            )
            .silentRun();
        });

        test('return INSUFFICIENT_VOCABULARY error if 2 vocabulary are returned from the database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 5;
          const termPosition = 0;
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

          let levels = new ModSequenceStrategy().getLevelsByTermPosition(
            termPosition,
            maxLevel
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn === mockedWritingModel.getDueVocabularyListByLevel
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.WRITING__FETCHING_VOCABULARY, {
                setId,
              })
            );

          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY_FAILED, {
                setId,
                errorCode: ErrorCode.WRITING__INSUFFICIENT_VOCABULARY,
                error: ErrorCode.WRITING__INSUFFICIENT_VOCABULARY,
              })
            )
            .silentRun();
        });

        test('return INSUFFICIENT_VOCABULARY error if 3 vocabulary with empty definitions are returned from the database', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 5;
          const termPosition = 0;
          const selectedCategoryNames = ['category'];

          const vocabularyList = Array(3)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({});
              }
            );

          let levels = new ModSequenceStrategy().getLevelsByTermPosition(
            termPosition,
            maxLevel
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn === mockedWritingModel.getDueVocabularyListByLevel
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.WRITING__FETCHING_VOCABULARY, { setId })
            );

          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY_FAILED, {
                setId,
                errorCode: ErrorCode.WRITING__INSUFFICIENT_VOCABULARY,
                error: ErrorCode.WRITING__INSUFFICIENT_VOCABULARY,
              })
            )
            .silentRun();
        });
      });

      describe('Tests with includeFromOtherCategories = true', (): void => {
        const includeFromOtherCategories = true;

        test('fetch vocabulary list successfully when including terms from other categories', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 5;
          const termPosition = 0;
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

          let levels = new ModSequenceStrategy().getLevelsByTermPosition(
            termPosition,
            maxLevel
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn === mockedWritingModel.getDueVocabularyListByLevel
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                limit,
                selectedCategoryNames,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.WRITING__FETCHING_VOCABULARY, { setId })
            );

          // First time fetch terms with selectedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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

          // Second time fetch terms with excludedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY_SUCCEEDED, {
                setId,
                vocabularyList: [...vocabularyList, ...vocabularyList],
              })
            )
            .silentRun();
        });

        test('return INSUFFICIENT_VOCABULARY error when including terms from other categories', async (): Promise<
          void
        > => {
          const setId = 'setId';
          const initialInterval = 12;
          const limit = 5;
          const termPosition = 0;
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

          let levels = new ModSequenceStrategy().getLevelsByTermPosition(
            termPosition,
            maxLevel
          );

          saga
            .provide({
              call(effect, next): object {
                if (
                  effect.fn === mockedWritingModel.getDueVocabularyListByLevel
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY, {
                setId,
                initialInterval,
                selectedCategoryNames,
                limit,
                includeFromOtherCategories,
              })
            )
            .put(
              createAction(ActionType.WRITING__FETCHING_VOCABULARY, {
                setId,
              })
            );

          // First time fetch terms with selectedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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

          // Second time fetch terms with excludedCategoryNames
          levels.forEach(
            (level): void => {
              saga.call(
                [mockedWritingModel, 'getDueVocabularyListByLevel'],
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
              createAction(ActionType.WRITING__FETCH_VOCABULARY_FAILED, {
                setId,
                errorCode: ErrorCode.WRITING__INSUFFICIENT_VOCABULARY,
                error: ErrorCode.WRITING__INSUFFICIENT_VOCABULARY,
              })
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
            writingSaga.allowSaveResult.bind(writingSaga),
            maxLevel
          );
          vocabularyList = Array(5)
            .fill(null)
            .map(
              (): Vocabulary => {
                return new VocabularyBuilder().build({
                  writing: {
                    level: 5,
                  },
                });
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
        const setId = 'setId';
        const feedbackList = new Map(
          _.values(Feedback).map(
            (feedback, index): [string, Feedback] => {
              return [vocabularyList[index].vocabularyId, feedback as Feedback];
            }
          )
        );

        await saga
          .dispatch(
            createAction(ActionType.WRITING__SAVE_RESULT, {
              setId,
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
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 10,
              },
              incrementTermPosition: true,
            })
          )
          .put(createAction(ActionType.WRITING__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null))
          .silentRun();

        const expectedResults = [
          { vocabularyId: vocabularyList[0].vocabularyId, level: 1 },
          { vocabularyId: vocabularyList[1].vocabularyId, level: 3 },
          { vocabularyId: vocabularyList[2].vocabularyId, level: 6 },
          { vocabularyId: vocabularyList[3].vocabularyId, level: 7 },
          { vocabularyId: vocabularyList[4].vocabularyId, level: 8 },
        ];

        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (result): [DeepPartial<Vocabulary>, undefined] => {
              return [
                {
                  vocabularyId: result.vocabularyId,
                  writing: {
                    lastWrittenAt: moment().toDate(),
                    level: result.level,
                  },
                },
                undefined,
              ];
            }
          ),
          'local'
        );
      });

      test('archive vocabulary based on vocabulary level', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const feedbackList = new Map(
          _.values(Feedback).map(
            (feedback, index): [string, Feedback] => {
              return [vocabularyList[index].vocabularyId, feedback as Feedback];
            }
          )
        );

        await saga
          .dispatch(
            createAction(ActionType.WRITING__SAVE_RESULT, {
              setId,
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
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 6,
              },
              incrementTermPosition: true,
            })
          )
          .put(createAction(ActionType.WRITING__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null))
          .silentRun();

        const expectedResults = [
          { vocabularyId: vocabularyList[0].vocabularyId, level: 1 },
          { vocabularyId: vocabularyList[1].vocabularyId, level: 3 },
          {
            vocabularyId: vocabularyList[2].vocabularyId,
            level: 6,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
          },
          {
            vocabularyId: vocabularyList[3].vocabularyId,
            level: 7,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
          },
          {
            vocabularyId: vocabularyList[4].vocabularyId,
            level: 8,
            vocabularyStatus: VocabularyStatus.ARCHIVED,
          },
        ];

        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          expectedResults.map(
            (result): [DeepPartial<Vocabulary>, undefined] => {
              return [
                {
                  vocabularyId: result.vocabularyId,
                  vocabularyStatus: result.vocabularyStatus,
                  writing: {
                    lastWrittenAt: moment().toDate(),
                    level: result.level,
                  },
                },
                undefined,
              ];
            }
          ),
          'local'
        );
      });

      test('increment term position', async (): Promise<void> => {
        const setId = 'setId';
        const currentTermPosition = 2;

        await saga
          .provide([
            [
              matchers.call.fn(mockedSessionModel.getWritingTermPosition),
              currentTermPosition,
            ],
          ])
          .dispatch(
            createAction(ActionType.WRITING__SAVE_RESULT, {
              setId,
              vocabularyList: new Map(),
              feedbackList: new Map(),
              autoArchiveSettings: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 6,
              },
              incrementTermPosition: true,
            })
          )
          .put(createAction(ActionType.WRITING__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null))
          .silentRun();

        expect(
          mockedSessionModel.upsertWritingTermPosition
        ).toHaveBeenCalledWith(
          mockedTransaction,
          setId,
          currentTermPosition + 1
        );
      });

      test('does not increment term position', async (): Promise<void> => {
        const setId = 'setId';

        await saga
          .dispatch(
            createAction(ActionType.WRITING__SAVE_RESULT, {
              setId,
              vocabularyList: new Map(),
              feedbackList: new Map(),
              autoArchiveSettings: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 6,
              },
              incrementTermPosition: false,
            })
          )
          .put(createAction(ActionType.WRITING__SAVING_RESULT, null))
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.WRITING__SAVE_RESULT_SUCCEEDED, null))
          .silentRun();

        expect(
          mockedSessionModel.upsertWritingTermPosition
        ).not.toHaveBeenCalled();
      });
    });
  });
});
