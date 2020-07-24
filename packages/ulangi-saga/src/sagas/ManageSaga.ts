/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  CategorySortType,
  VocabularyDueType,
} from '@ulangi/ulangi-common/enums';
import { Category } from '@ulangi/ulangi-common/interfaces';
import { CategoryFilterCondition } from '@ulangi/ulangi-common/types';
import {
  CategoryModel,
  SpacedRepetitionModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class ManageSaga extends ProtectedSaga {
  private fetchCategoryTask?: Task;

  private userDb: SQLiteDatabase;
  private categoryModel: CategoryModel;
  private spacedRepetitionModel: SpacedRepetitionModel;
  private writingModel: WritingModel;

  public constructor(
    userDb: SQLiteDatabase,
    categoryModel: CategoryModel,
    spacedRepetitionModel: SpacedRepetitionModel,
    writingModel: WritingModel
  ) {
    super();
    this.userDb = userDb;
    this.categoryModel = categoryModel;
    this.spacedRepetitionModel = spacedRepetitionModel;
    this.writingModel = writingModel;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowPrepareAndClearFetchCategory],
      config.manage.fetchCategoryLimit,
      config.spacedRepetition.maxLevel,
      config.writing.maxLevel
    );
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
        action.payload.filterCondition,
        action.payload.sortType,
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
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
    }
  }

  private *allowFetchCategory(
    filterCondition: CategoryFilterCondition,
    sortType: CategorySortType,
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
        if (filterCondition.filterBy === 'VocabularyStatus') {
          const { setId, vocabularyStatus } = filterCondition;

          const result: PromiseType<
            ReturnType<CategoryModel['getCategoryListByVocabularyStatus']>
          > = yield call(
            [this.categoryModel, 'getCategoryListByVocabularyStatus'],
            this.userDb,
            setId,
            vocabularyStatus,
            sortType,
            limitOfCategorized,
            offsetOfCategorized,
            shouldIncludeUncategorized
          );

          categoryList = result.categoryList;
        } else {
          const { setId, initialInterval, dueType } = filterCondition;
          if (dueType === VocabularyDueType.DUE_BY_SPACED_REPETITION) {
            const result: PromiseType<
              ReturnType<SpacedRepetitionModel['getDueCategoryList']>
            > = yield call(
              [this.spacedRepetitionModel, 'getDueCategoryList'],
              this.userDb,
              setId,
              initialInterval,
              spacedRepetitionMaxLevel,
              sortType,
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
              sortType,
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
        offsetOfCategorized += limitOfCategorized;

        yield put(
          createAction(ActionType.MANAGE__FETCH_CATEGORY_SUCCEEDED, {
            categoryList,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.MANAGE__FETCH_CATEGORY_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
