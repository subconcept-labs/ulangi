/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  VocabularyDueType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { Category } from '@ulangi/ulangi-common/interfaces';
import {
  CategoryModel,
  SpacedRepetitionModel,
  VocabularyModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class ManageSaga extends ProtectedSaga {
  private fetchVocabularyTask?: Task;
  private fetchCategoryTask?: Task;

  private userDb: SQLiteDatabase;
  private vocabularyModel: VocabularyModel;
  private categoryModel: CategoryModel;
  private spacedRepetitionModel: SpacedRepetitionModel;
  private writingModel: WritingModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    vocabularyModel: VocabularyModel,
    categoryModel: CategoryModel,
    spacedRepetitionModel: SpacedRepetitionModel,
    writingModel: WritingModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.userDb = userDb;
    this.vocabularyModel = vocabularyModel;
    this.categoryModel = categoryModel;
    this.spacedRepetitionModel = spacedRepetitionModel;
    this.writingModel = writingModel;
    this.crashlytics = crashlytics;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowPrepareAndClearFetchVocabulary],
      config.manage.fetchVocabularyLimit,
      config.spacedRepetition.maxLevel,
      config.writing.maxLevel
    );
    yield fork(
      [this, this.allowPrepareAndClearFetchCategory],
      config.manage.fetchCategoryLimit,
      config.spacedRepetition.maxLevel,
      config.writing.maxLevel
    );
  }

  public *allowPrepareAndClearFetchVocabulary(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    this.fetchVocabularyTask = yield fork(
      [this, this.allowPrepareFetchVocabulary],
      limit,
      spacedRepetitionMaxLevel,
      writingMaxLevel
    );
    yield fork(
      [this, this.allowClearFetchVocabulary],
      limit,
      spacedRepetitionMaxLevel,
      writingMaxLevel
    );
  }

  private *allowClearFetchVocabulary(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.MANAGE__CLEAR_FETCH_VOCABULARY);
      if (typeof this.fetchVocabularyTask !== 'undefined') {
        yield cancel(this.fetchVocabularyTask);
      }

      this.fetchVocabularyTask = yield fork(
        [this, this.allowPrepareFetchVocabulary],
        limit,
        spacedRepetitionMaxLevel,
        writingMaxLevel
      );
    }
  }

  private *allowPrepareFetchVocabulary(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    try {
      const action: Action<
        ActionType.MANAGE__PREPARE_FETCH_VOCABULARY
      > = yield take(ActionType.MANAGE__PREPARE_FETCH_VOCABULARY);

      yield put(
        createAction(ActionType.MANAGE__PREPARING_FETCH_VOCABULARY, null)
      );

      yield fork(
        [this, this.allowFetchVocabulary],
        action.payload,
        limit,
        spacedRepetitionMaxLevel,
        writingMaxLevel
      );

      yield put(
        createAction(
          ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
          null
        )
      );
    } catch (error) {
      yield put(
        createAction(ActionType.MANAGE__PREPARE_FETCH_VOCABULARY_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private *allowFetchVocabulary(
    payload:
      | {
          filterBy: 'VocabularyStatus';
          setId: string;
          vocabularyStatus: VocabularyStatus;
          categoryName?: string;
        }
      | {
          filterBy: 'VocabularyDueType';
          setId: string;
          initialInterval: number;
          dueType: VocabularyDueType;
          categoryName?: string;
        },
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    let offset = 0;
    while (true) {
      yield take(ActionType.MANAGE__FETCH_VOCABULARY);
      try {
        yield put(createAction(ActionType.MANAGE__FETCHING_VOCABULARY, null));

        let result: PromiseType<
          ReturnType<
            | VocabularyModel['getVocabularyList']
            | SpacedRepetitionModel['getDueVocabularyList']
            | WritingModel['getDueVocabularyList']
          >
        >;
        if (payload.filterBy === 'VocabularyStatus') {
          const { setId, vocabularyStatus, categoryName } = payload;

          result = yield call(
            [this.vocabularyModel, 'getVocabularyList'],
            this.userDb,
            setId,
            vocabularyStatus,
            typeof categoryName !== 'undefined' ? [categoryName] : undefined,
            limit,
            offset,
            true
          );
        } else {
          const { setId, initialInterval, dueType, categoryName } = payload;

          if (dueType === VocabularyDueType.DUE_BY_SPACED_REPETITION) {
            result = yield call(
              [this.spacedRepetitionModel, 'getDueVocabularyList'],
              this.userDb,
              setId,
              initialInterval,
              spacedRepetitionMaxLevel,
              typeof categoryName !== 'undefined' ? [categoryName] : undefined,
              limit,
              offset,
              true
            );
          } else if (dueType === VocabularyDueType.DUE_BY_WRITING) {
            result = yield call(
              [this.writingModel, 'getDueVocabularyList'],
              this.userDb,
              setId,
              initialInterval,
              writingMaxLevel,
              typeof categoryName !== 'undefined' ? [categoryName] : undefined,
              limit,
              offset,
              true
            );
          } else {
            throw new Error('Unsupported due type');
          }
        }

        const { vocabularyList } = result;
        offset = vocabularyList.length + offset;

        let noMore = false;
        if (vocabularyList.length === 0) {
          noMore = true;
        }

        yield put(
          createAction(ActionType.MANAGE__FETCH_VOCABULARY_SUCCEEDED, {
            vocabularyList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.MANAGE__FETCH_VOCABULARY_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowPrepareAndClearFetchCategory(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    this.fetchCategoryTask = yield fork(
      [this, this.allowPrepareFetchCategory],
      limit,
      spacedRepetitionMaxLevel,
      writingMaxLevel
    );
    yield fork(
      [this, this.allowClearFetchCategory],
      limit,
      spacedRepetitionMaxLevel,
      writingMaxLevel
    );
  }

  private *allowClearFetchCategory(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    while (true) {
      yield take(ActionType.MANAGE__CLEAR_FETCH_CATEGORY);
      if (typeof this.fetchCategoryTask !== 'undefined') {
        yield cancel(this.fetchCategoryTask);
      }

      this.fetchCategoryTask = yield fork(
        [this, this.allowPrepareFetchCategory],
        limit,
        spacedRepetitionMaxLevel,
        writingMaxLevel
      );
    }
  }

  private *allowPrepareFetchCategory(
    limit: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    try {
      const action: Action<
        ActionType.MANAGE__PREPARE_FETCH_CATEGORY
      > = yield take(ActionType.MANAGE__PREPARE_FETCH_CATEGORY);

      yield put(
        createAction(ActionType.MANAGE__PREPARING_FETCH_CATEGORY, null)
      );

      yield fork(
        [this, this.allowFetchCategory],
        action.payload,
        limit,
        spacedRepetitionMaxLevel,
        writingMaxLevel
      );

      yield put(
        createAction(ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED, null)
      );
    } catch (error) {
      yield put(
        createAction(ActionType.MANAGE__PREPARE_FETCH_CATEGORY_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private *allowFetchCategory(
    payload:
      | {
          filterBy: 'VocabularyStatus';
          setId: string;
          vocabularyStatus: VocabularyStatus;
        }
      | {
          filterBy: 'VocabularyDueType';
          setId: string;
          initialInterval: number;
          dueType: VocabularyDueType;
        },
    limitOfCategorized: number,
    spacedRepetitionMaxLevel: number,
    writingMaxLevel: number
  ): IterableIterator<any> {
    let offsetOfCategorized = 0;
    let shouldIncludeUncategorized = true;
    while (true) {
      yield take(ActionType.MANAGE__FETCH_CATEGORY);

      try {
        yield put(createAction(ActionType.MANAGE__FETCHING_CATEGORY, null));

        let categoryList;
        if (payload.filterBy === 'VocabularyStatus') {
          const { setId, vocabularyStatus } = payload;

          const result: PromiseType<
            ReturnType<CategoryModel['getCategoryListByVocabularyStatus']>
          > = yield call(
            [this.categoryModel, 'getCategoryListByVocabularyStatus'],
            this.userDb,
            setId,
            vocabularyStatus,
            limitOfCategorized,
            offsetOfCategorized,
            shouldIncludeUncategorized
          );

          categoryList = result.categoryList;
        } else {
          const { setId, initialInterval, dueType } = payload;
          if (dueType === VocabularyDueType.DUE_BY_SPACED_REPETITION) {
            const result: PromiseType<
              ReturnType<SpacedRepetitionModel['getDueCategoryList']>
            > = yield call(
              [this.spacedRepetitionModel, 'getDueCategoryList'],
              this.userDb,
              setId,
              initialInterval,
              spacedRepetitionMaxLevel,
              limitOfCategorized,
              offsetOfCategorized,
              shouldIncludeUncategorized
            );

            categoryList = result.categoryList;
          } else if (dueType === VocabularyDueType.DUE_BY_WRITING) {
            const result: PromiseType<
              ReturnType<WritingModel['getDueCategoryList']>
            > = yield call(
              [this.writingModel, 'getDueCategoryList'],
              this.userDb,
              setId,
              initialInterval,
              writingMaxLevel,
              limitOfCategorized,
              offsetOfCategorized,
              shouldIncludeUncategorized
            );

            categoryList = result.categoryList;
          } else {
            throw new Error('Unknown due type');
          }
        }

        const categoryListWithoutUncategorized = categoryList.filter(
          (category: Category): boolean => {
            return category.categoryName !== 'Uncategorized';
          }
        );
        const noMore =
          categoryListWithoutUncategorized.length === 0 ? true : false;
        // Should not include Uncategorized in the next fetch
        shouldIncludeUncategorized = false;
        offsetOfCategorized =
          categoryListWithoutUncategorized.length + offsetOfCategorized;

        yield put(
          createAction(ActionType.MANAGE__FETCH_CATEGORY_SUCCEEDED, {
            categoryList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.MANAGE__FETCH_CATEGORY_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
}
