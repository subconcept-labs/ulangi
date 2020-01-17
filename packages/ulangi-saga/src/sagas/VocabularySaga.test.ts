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
  VocabularyDueType,
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
  WritingModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { VocabularySaga } from '../sagas/VocabularySaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  VocabularyModel: VocabularyModelMock,
  SpacedRepetitionModel: SpacedRepetitionModelMock,
  WritingModel: WritingModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('VocabularySaga', (): void => {
  describe('Tests start with all mocked modules', (): void => {
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedWritingModel: jest.Mocked<WritingModel>;
    let mockedSpacedRepetitionModel: jest.Mocked<SpacedRepetitionModel>;
    let vocabularySaga: VocabularySaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedVocabularyModel = new VocabularyModelMock();
        mockedSpacedRepetitionModel = new SpacedRepetitionModelMock();
        mockedWritingModel = new WritingModelMock();

        vocabularySaga = new VocabularySaga(
          mockedUserDatabase,
          mockedVocabularyModel,
          mockedSpacedRepetitionModel,
          mockedWritingModel
        );
      }
    );

    describe('Test allowAdd', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(vocabularySaga.allowAdd.bind(vocabularySaga));
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('add success flow', async (): Promise<void> => {
        const setId = 'setId';
        const vocabulary = new VocabularyBuilder().build({
          vocabularyText: 'vocabulary',
          definitions: [
            {
              meaning: 'meaning',
              source: 'source',
            },
          ],
          category: {
            categoryName: 'categoryName',
          },
          writing: {
            level: 2,
            disabled: true,
            lastWrittenAt: moment().unix(),
          },
        });

        await saga
          .dispatch(
            createAction(ActionType.VOCABULARY__ADD, {
              vocabulary,
              setId,
            })
          )
          .put(createAction(ActionType.VOCABULARY__ADDING, { vocabulary }))
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(ActionType.VOCABULARY__ADD_SUCCEEDED, { vocabulary })
          )
          .silentRun();

        expect(mockedVocabularyModel.insertVocabulary).toHaveBeenCalledWith(
          mockedTransaction,
          vocabulary,
          setId,
          'local'
        );
      });

      test('add failed if vocabulary has no definitions', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const vocabulary = new VocabularyBuilder().build({});
        await saga
          .dispatch(
            createAction(ActionType.VOCABULARY__ADD, { vocabulary, setId })
          )
          .put(
            createAction(ActionType.VOCABULARY__ADD_FAILED, {
              vocabulary,
              errorCode: ErrorCode.VOCABULARY__NO_DEFINITIONS,
              error: ErrorCode.VOCABULARY__NO_DEFINITIONS,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowAddMultiple', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            vocabularySaga.allowAddMultiple.bind(vocabularySaga)
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('add multiple success flow', async (): Promise<void> => {
        const setId = 'setId';
        const vocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'vocabulary' + index,
                definitions: [
                  {
                    meaning: 'meaning' + index,
                    source: 'source' + index,
                  },
                ],
                category: {
                  categoryName: 'categoryName' + index,
                },
                writing: {
                  level: 4,
                  disabled: false,
                  lastWrittenAt: moment().unix(),
                },
              });
            }
          );

        await saga
          .dispatch(
            createAction(ActionType.VOCABULARY__ADD_MULTIPLE, {
              vocabularyList,
              setId,
            })
          )
          .put(
            createAction(ActionType.VOCABULARY__ADDING_MULTIPLE, {
              vocabularyList,
            })
          )
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(ActionType.VOCABULARY__ADD_MULTIPLE_SUCCEEDED, {
              vocabularyList,
            })
          )
          .silentRun();

        expect(
          mockedVocabularyModel.insertMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          vocabularyList.map(
            (vocabulary): [Vocabulary, string] => [vocabulary, setId]
          ),
          'local'
        );
      });
    });

    describe('Test allowEdit', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(vocabularySaga.allowEdit.bind(vocabularySaga));
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('edit success flow', async (): Promise<void> => {
        const setId = 'new set';

        const editedVocabulary = {
          vocabularyId: 'vocabularyId',
          vocabularyText: 'test',
          definitions: [
            {
              definitionId: 'edited definition',
              meaning: 'edited',
            },
            new DefinitionBuilder().build({
              definitionId: 'new definition',
              meaning: 'new',
              source: 'source',
            }),
          ],
          category: {
            categoryName: 'categoryName',
          },
          writing: {
            disabled: false,
            level: 4,
          },
        };

        const updatedVocabulary = new VocabularyBuilder().build(
          editedVocabulary
        );

        await saga
          .provide([
            [
              matchers.call.fn(mockedVocabularyModel.getVocabularyById),
              { vocabulary: updatedVocabulary },
            ],
          ])
          .dispatch(
            createAction(ActionType.VOCABULARY__EDIT, {
              vocabulary: editedVocabulary,
              setId,
            })
          )
          .put(
            createAction(ActionType.VOCABULARY__EDITING, {
              vocabulary: editedVocabulary,
            })
          )
          .call.fn(mockedUserDatabase.transaction)
          .call(
            [mockedVocabularyModel, 'getVocabularyById'],
            mockedUserDatabase,
            editedVocabulary.vocabularyId,
            true
          )
          .put(
            createAction(ActionType.VOCABULARY__EDIT_SUCCEEDED, {
              vocabulary: updatedVocabulary,
              setId,
            })
          )
          .silentRun();

        expect(mockedVocabularyModel.updateVocabulary).toHaveBeenCalledWith(
          mockedTransaction,
          editedVocabulary,
          setId,
          'local'
        );
      });
    });

    describe('Test allowEditMultiple', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            vocabularySaga.allowEditMultiple.bind(vocabularySaga)
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('edit multiple success flow', async (): Promise<void> => {
        const editedVocabularyList = [
          {
            vocabularyId: 'vocabulary1',
            vocabularyText: 'edited vocabulary 1',
            definitions: [
              {
                definitionId: 'editedDefinitionId',
                meaning: 'edited meaning',
              },
              new DefinitionBuilder().build({
                definitionId: 'new definition',
                meaning: 'new',
                source: 'source',
              }),
            ],
            category: {
              categoryName: 'categoryName',
            },
            writing: {
              disabled: false,
              level: 4,
            },
          },
          {
            vocabularyId: 'vocabulary2',
            vocabularyText: 'edited vocabulary 2',
          },
        ];

        const vocabularyIdSetIdPairs = editedVocabularyList.map(
          (vocabulary, index): [string, string] => {
            return [vocabulary.vocabularyId, 'setId' + index];
          }
        );

        const vocabularyIdSetIdMap = _.fromPairs(vocabularyIdSetIdPairs);

        await saga
          .dispatch(
            createAction(ActionType.VOCABULARY__EDIT_MULTIPLE, {
              vocabularyList: editedVocabularyList,
              vocabularyIdSetIdPairs,
            })
          )
          .put(
            createAction(ActionType.VOCABULARY__EDITING_MULTIPLE, {
              vocabularyList: editedVocabularyList,
            })
          )
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(ActionType.VOCABULARY__EDIT_MULTIPLE_SUCCEEDED, null)
          )
          .silentRun();

        expect(
          mockedVocabularyModel.updateMultipleVocabulary
        ).toHaveBeenCalledWith(
          mockedTransaction,
          editedVocabularyList.map(
            (vocabulary): [DeepPartial<Vocabulary>, undefined | string] => [
              vocabulary,
              vocabularyIdSetIdMap[vocabulary.vocabularyId],
            ]
          ),
          'local'
        );
      });
    });

    describe('Test allowPrepareAndClearFetch', (): void => {
      const limit = 10;
      const spacedRepetitionMaxLevel = 10;
      const writingMaxLevel = 10;
      let restoreCurrentTime: () => void;
      beforeEach(
        async (): Promise<void> => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            vocabularySaga.allowPrepareAndClearFetch.bind(vocabularySaga),
            limit,
            spacedRepetitionMaxLevel,
            writingMaxLevel
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('clear then prepare fetch vocabulary', async (): Promise<void> => {
        const setId = 'setId';
        const vocabularyStatus = VocabularyStatus.ACTIVE;

        await saga
          .dispatch(createAction(ActionType.VOCABULARY__CLEAR_FETCH, null))
          .dispatch(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH, {
              filterBy: 'VocabularyStatus',
              setId,
              vocabularyStatus,
            })
          )
          .put(createAction(ActionType.VOCABULARY__PREPARING_FETCH, null))
          .put(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED, null)
          )
          .silentRun();
      });

      test('prepare and fetch vocabulary by vocabularyStatus and categoryName', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const vocabularyStatus = VocabularyStatus.ACTIVE;
        const categoryName = 'animals';

        const offset = 0;
        const stripUnknown = true;
        const vocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'vocabulary' + index,
              });
            }
          );

        await saga
          .provide([
            [
              matchers.call.fn(mockedVocabularyModel.getVocabularyList),
              { vocabularyList },
            ],
          ])
          .dispatch(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH, {
              filterBy: 'VocabularyStatus',
              setId,
              vocabularyStatus,
              categoryName,
            })
          )
          .put(createAction(ActionType.VOCABULARY__PREPARING_FETCH, null))
          .put(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED, null)
          )
          .dispatch(createAction(ActionType.VOCABULARY__FETCH, null))
          .put(createAction(ActionType.VOCABULARY__FETCHING, null))
          .call(
            [mockedVocabularyModel, 'getVocabularyList'],
            mockedUserDatabase,
            setId,
            vocabularyStatus,
            [categoryName],
            limit,
            offset,
            stripUnknown
          )
          .put(
            createAction(ActionType.VOCABULARY__FETCH_SUCCEEDED, {
              vocabularyList,
              noMore: false,
            })
          )
          .silentRun();
      });

      test('prepare and fetch vocabulary by DUE_BY_SPACED_REPETITION and categoryName', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const initialInterval = 12;
        const dueType = VocabularyDueType.DUE_BY_SPACED_REPETITION;
        const categoryName = 'animals';

        const offset = 0;
        const stripUnknown = true;
        const vocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'vocabulary' + index,
              });
            }
          );

        await saga
          .provide([
            [
              matchers.call.fn(
                mockedSpacedRepetitionModel.getDueVocabularyList
              ),
              { vocabularyList },
            ],
          ])
          .dispatch(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH, {
              filterBy: 'VocabularyDueType',
              setId,
              initialInterval,
              dueType,
              categoryName,
            })
          )
          .put(createAction(ActionType.VOCABULARY__PREPARING_FETCH, null))
          .put(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED, null)
          )
          .dispatch(createAction(ActionType.VOCABULARY__FETCH, null))
          .put(createAction(ActionType.VOCABULARY__FETCHING, null))
          .call(
            [mockedSpacedRepetitionModel, 'getDueVocabularyList'],
            mockedUserDatabase,
            setId,
            initialInterval,
            spacedRepetitionMaxLevel,
            [categoryName],
            limit,
            offset,
            stripUnknown
          )
          .put(
            createAction(ActionType.VOCABULARY__FETCH_SUCCEEDED, {
              vocabularyList,
              noMore: false,
            })
          )
          .silentRun();
      });

      test('prepare and fetch vocabulary by DUE_BY_WRITING and categoryName', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const initialInterval = 12;
        const dueType = VocabularyDueType.DUE_BY_WRITING;
        const categoryName = 'animals';

        const offset = 0;
        const stripUnknown = true;
        const vocabularyList = Array(4)
          .fill(null)
          .map(
            (_, index): Vocabulary => {
              return new VocabularyBuilder().build({
                vocabularyText: 'vocabulary' + index,
              });
            }
          );

        await saga
          .provide([
            [
              matchers.call.fn(mockedWritingModel.getDueVocabularyList),
              { vocabularyList },
            ],
          ])
          .dispatch(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH, {
              filterBy: 'VocabularyDueType',
              setId,
              initialInterval,
              dueType,
              categoryName,
            })
          )
          .put(createAction(ActionType.VOCABULARY__PREPARING_FETCH, null))
          .put(
            createAction(ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED, null)
          )
          .dispatch(createAction(ActionType.VOCABULARY__FETCH, null))
          .put(createAction(ActionType.VOCABULARY__FETCHING, null))
          .call(
            [mockedWritingModel, 'getDueVocabularyList'],
            mockedUserDatabase,
            setId,
            initialInterval,
            writingMaxLevel,
            [categoryName],
            limit,
            offset,
            stripUnknown
          )
          .put(
            createAction(ActionType.VOCABULARY__FETCH_SUCCEEDED, {
              vocabularyList,
              noMore: false,
            })
          )
          .silentRun();
      });
    });
  });
});
