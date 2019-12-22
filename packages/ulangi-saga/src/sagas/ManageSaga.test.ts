/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import {
  VocabularyDueType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Category, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  CategoryModel,
  SpacedRepetitionModel,
  VocabularyModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { ManageSaga } from '../sagas/ManageSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  CategoryModel: CategoryModelMock,
  VocabularyModel: VocabularyModelMock,
  WritingModel: WritingModelMock,
  SpacedRepetitionModel: SpacedRepetitionModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('ManageSaga', (): void => {
  describe('Tests start with all mocked modules', (): void => {
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedVocabularyModel: jest.Mocked<VocabularyModel>;
    let mockedCategoryModel: jest.Mocked<CategoryModel>;
    let mockedSpacedRepetitionModel: jest.Mocked<SpacedRepetitionModel>;
    let mockedWritingModel: jest.Mocked<WritingModel>;
    let manageSaga: ManageSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);

        mockedVocabularyModel = new VocabularyModelMock();
        mockedCategoryModel = new CategoryModelMock();
        mockedWritingModel = new WritingModelMock();
        mockedSpacedRepetitionModel = new SpacedRepetitionModelMock();

        manageSaga = new ManageSaga(
          mockedUserDatabase,
          mockedVocabularyModel,
          mockedCategoryModel,
          mockedSpacedRepetitionModel,
          mockedWritingModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test allowPrepareAndClearFetchVocabulary', (): void => {
      const limit = 10;
      const spacedRepetitionMaxLevel = 10;
      const writingMaxLevel = 10;
      let restoreCurrentTime: () => void;

      beforeEach(
        async (): Promise<void> => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            manageSaga.allowPrepareAndClearFetchVocabulary.bind(manageSaga),
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
          .dispatch(
            createAction(ActionType.MANAGE__CLEAR_FETCH_VOCABULARY, null)
          )
          .dispatch(
            createAction(ActionType.MANAGE__PREPARE_FETCH_VOCABULARY, {
              filterBy: 'VocabularyStatus',
              setId,
              vocabularyStatus,
            })
          )
          .put(
            createAction(ActionType.MANAGE__PREPARING_FETCH_VOCABULARY, null)
          )
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
              null
            )
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
            createAction(ActionType.MANAGE__PREPARE_FETCH_VOCABULARY, {
              filterBy: 'VocabularyStatus',
              setId,
              vocabularyStatus,
              categoryName,
            })
          )
          .put(
            createAction(ActionType.MANAGE__PREPARING_FETCH_VOCABULARY, null)
          )
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
              null
            )
          )
          .dispatch(createAction(ActionType.MANAGE__FETCH_VOCABULARY, null))
          .put(createAction(ActionType.MANAGE__FETCHING_VOCABULARY, null))
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
            createAction(ActionType.MANAGE__FETCH_VOCABULARY_SUCCEEDED, {
              vocabularyList,
              noMore: false,
            })
          )
          .silentRun();
      });

      test('prepare and fetch vocabulary by DUE_BY_SPACED_REPETITION with category', async (): Promise<
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
            createAction(ActionType.MANAGE__PREPARE_FETCH_VOCABULARY, {
              filterBy: 'VocabularyDueType',
              setId,
              initialInterval,
              dueType,
              categoryName,
            })
          )
          .put(
            createAction(ActionType.MANAGE__PREPARING_FETCH_VOCABULARY, null)
          )
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
              null
            )
          )
          .dispatch(createAction(ActionType.MANAGE__FETCH_VOCABULARY, null))
          .put(createAction(ActionType.MANAGE__FETCHING_VOCABULARY, null))
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
            createAction(ActionType.MANAGE__FETCH_VOCABULARY_SUCCEEDED, {
              vocabularyList,
              noMore: false,
            })
          )
          .silentRun();
      });

      test('prepare and fetch vocabulary by DUE_BY_WRITING with category', async (): Promise<
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
            createAction(ActionType.MANAGE__PREPARE_FETCH_VOCABULARY, {
              filterBy: 'VocabularyDueType',
              setId,
              initialInterval,
              dueType,
              categoryName,
            })
          )
          .put(
            createAction(ActionType.MANAGE__PREPARING_FETCH_VOCABULARY, null)
          )
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
              null
            )
          )
          .dispatch(createAction(ActionType.MANAGE__FETCH_VOCABULARY, null))
          .put(createAction(ActionType.MANAGE__FETCHING_VOCABULARY, null))
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
            createAction(ActionType.MANAGE__FETCH_VOCABULARY_SUCCEEDED, {
              vocabularyList,
              noMore: false,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowPrepareAndClearFetchCategory', (): void => {
      const limit = 10;
      const spacedRepetitionMaxLevel = 10;
      const writingMaxLevel = 10;
      beforeEach(
        (): void => {
          saga = expectSaga(
            manageSaga.allowPrepareAndClearFetchCategory.bind(manageSaga),
            limit,
            spacedRepetitionMaxLevel,
            writingMaxLevel
          );
        }
      );

      test('clear fetch and prepare fetch category', async (): Promise<
        void
      > => {
        await saga
          .dispatch(createAction(ActionType.MANAGE__CLEAR_FETCH_CATEGORY, null))
          .dispatch(
            createAction(ActionType.MANAGE__PREPARE_FETCH_CATEGORY, {
              filterBy: 'VocabularyStatus',
              setId: 'setId',
              vocabularyStatus: VocabularyStatus.ACTIVE,
            })
          )
          .put(createAction(ActionType.MANAGE__PREPARING_FETCH_CATEGORY, null))
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED,
              null
            )
          )
          .silentRun();
      });

      test('prepare then fetch category by vocabularyStatus', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const vocabularyStatus = VocabularyStatus.ACTIVE;
        const offset = 0;
        const uncategorizedCount = 5;
        const includeUncategorized = true;

        const categoryList: Category[] = [
          { categoryName: 'Uncategorized', count: uncategorizedCount },
          { categoryName: 'categoryName', count: 1 },
        ];

        await saga
          .provide([
            [
              matchers.call.fn(
                mockedCategoryModel.getCategoryListByVocabularyStatus
              ),
              { categoryList },
            ],
          ])
          .dispatch(createAction(ActionType.MANAGE__CLEAR_FETCH_CATEGORY, null))
          .dispatch(
            createAction(ActionType.MANAGE__PREPARE_FETCH_CATEGORY, {
              filterBy: 'VocabularyStatus',
              setId,
              vocabularyStatus: VocabularyStatus.ACTIVE,
            })
          )
          .put(createAction(ActionType.MANAGE__PREPARING_FETCH_CATEGORY, null))
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED,
              null
            )
          )
          .dispatch(createAction(ActionType.MANAGE__FETCH_CATEGORY, null))
          .call(
            [mockedCategoryModel, 'getCategoryListByVocabularyStatus'],
            mockedUserDatabase,
            setId,
            vocabularyStatus,
            limit,
            offset,
            includeUncategorized
          )
          .put(
            createAction(ActionType.MANAGE__FETCH_CATEGORY_SUCCEEDED, {
              categoryList,
              noMore: false,
            })
          )
          .silentRun();
      });

      test('prepare then fetch category by DUE_BY_SPACED_REPETITION', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const initialInterval = 12;
        const offset = 0;
        const uncategorizedCount = 5;
        const includeUncategorized = true;

        const categoryList: Category[] = [
          { categoryName: 'Uncategorized', count: uncategorizedCount },
          { categoryName: 'categoryName', count: 1 },
        ];

        await saga
          .provide([
            [
              matchers.call.fn(mockedSpacedRepetitionModel.getDueCategoryList),
              { categoryList },
            ],
          ])
          .dispatch(createAction(ActionType.MANAGE__CLEAR_FETCH_CATEGORY, null))
          .dispatch(
            createAction(ActionType.MANAGE__PREPARE_FETCH_CATEGORY, {
              filterBy: 'VocabularyDueType',
              setId,
              initialInterval,
              dueType: VocabularyDueType.DUE_BY_SPACED_REPETITION,
            })
          )
          .put(createAction(ActionType.MANAGE__PREPARING_FETCH_CATEGORY, null))
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED,
              null
            )
          )
          .dispatch(createAction(ActionType.MANAGE__FETCH_CATEGORY, null))
          .call(
            [mockedSpacedRepetitionModel, 'getDueCategoryList'],
            mockedUserDatabase,
            setId,
            initialInterval,
            spacedRepetitionMaxLevel,
            limit,
            offset,
            includeUncategorized
          )
          .put(
            createAction(ActionType.MANAGE__FETCH_CATEGORY_SUCCEEDED, {
              categoryList,
              noMore: false,
            })
          )
          .silentRun();
      });

      test('prepare then fetch category by DUE_BY_WRITING', async (): Promise<
        void
      > => {
        const setId = 'setId';
        const initialInterval = 12;
        const offset = 0;
        const uncategorizedCount = 5;
        const includeUncategorized = true;

        const categoryList: Category[] = [
          { categoryName: 'Uncategorized', count: uncategorizedCount },
          { categoryName: 'categoryName', count: 1 },
        ];

        await saga
          .provide([
            [
              matchers.call.fn(mockedWritingModel.getDueCategoryList),
              { categoryList },
            ],
          ])
          .dispatch(createAction(ActionType.MANAGE__CLEAR_FETCH_CATEGORY, null))
          .dispatch(
            createAction(ActionType.MANAGE__PREPARE_FETCH_CATEGORY, {
              filterBy: 'VocabularyDueType',
              setId,
              initialInterval,
              dueType: VocabularyDueType.DUE_BY_WRITING,
            })
          )
          .put(createAction(ActionType.MANAGE__PREPARING_FETCH_CATEGORY, null))
          .put(
            createAction(
              ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED,
              null
            )
          )
          .dispatch(createAction(ActionType.MANAGE__FETCH_CATEGORY, null))
          .call(
            [mockedWritingModel, 'getDueCategoryList'],
            mockedUserDatabase,
            setId,
            initialInterval,
            writingMaxLevel,
            limit,
            offset,
            includeUncategorized
          )
          .put(
            createAction(ActionType.MANAGE__FETCH_CATEGORY_SUCCEEDED, {
              categoryList,
              noMore: false,
            })
          )
          .silentRun();
      });
    });
  });
});
