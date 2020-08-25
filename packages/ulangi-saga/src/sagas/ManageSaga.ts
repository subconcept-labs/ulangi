/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { CategorySortType } from '@ulangi/ulangi-common/enums';
import { CategoryFilterCondition } from '@ulangi/ulangi-common/types';
import {
  CategoryModel,
  SpacedRepetitionModel,
  WritingModel,
} from '@ulangi/ulangi-local-database';
import * as _ from 'lodash';
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
      config.manage.fetchCategoryLimit
    );

    yield fork(
      [this, this.allowFetchSpacedRepetitionDueAndNewCounts],
      config.spacedRepetition.maxLevel
    );
    yield fork(
      [this, this.allowFetchWritingDueAndNewCounts],
      config.spacedRepetition.maxLevel
    );
  }

  public *allowPrepareAndClearFetchCategory(
    limit: number
  ): IterableIterator<any> {
    this.fetchCategoryTask = yield fork(
      [this, this.allowPrepareFetchCategory],
      limit
    );
    yield fork([this, this.allowClearFetchCategory], limit);
  }

  private *allowClearFetchCategory(limit: number): IterableIterator<any> {
    while (true) {
      yield take(ActionType.MANAGE__CLEAR_FETCH_CATEGORY);
      if (typeof this.fetchCategoryTask !== 'undefined') {
        yield cancel(this.fetchCategoryTask);
      }

      this.fetchCategoryTask = yield fork(
        [this, this.allowPrepareFetchCategory],
        limit
      );
    }
  }

  private *allowPrepareFetchCategory(limit: number): IterableIterator<any> {
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
        limit
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
    limit: number
  ): IterableIterator<any> {
    let offset = 0;

    while (true) {
      yield take(ActionType.MANAGE__FETCH_CATEGORY);

      try {
        yield put(createAction(ActionType.MANAGE__FETCHING_CATEGORY, null));

        const { setId, vocabularyStatus } = filterCondition;

        const {
          categoryList,
        }: PromiseType<
          ReturnType<CategoryModel['getCategoryListByVocabularyStatus']>
        > = yield call(
          [this.categoryModel, 'getCategoryListByVocabularyStatus'],
          this.userDb,
          setId,
          vocabularyStatus,
          sortType,
          limit,
          offset
        );

        const noMore = categoryList.length === 0 ? true : false;

        offset += limit;

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

  public *allowFetchSpacedRepetitionDueAndNewCounts(
    maxLevel: number
  ): IterableIterator<any> {
    while (true) {
      const action = yield take(
        ActionType.MANAGE__FETCH_SPACED_REPETITION_DUE_AND_NEW_COUNTS
      );
      const { setId, initialInterval, categoryNames } = action.payload;

      yield fork(
        [this, this.fetchSpacedRepetitionDueAndNewCounts],
        setId,
        maxLevel,
        initialInterval,
        categoryNames
      );
    }
  }

  public *fetchSpacedRepetitionDueAndNewCounts(
    setId: string,
    maxLevel: number,
    initialInterval: number,
    categoryNames: string[]
  ): IterableIterator<any> {
    try {
      yield put(
        createAction(
          ActionType.MANAGE__FETCHING_SPACED_REPETITION_DUE_AND_NEW_COUNTS,
          null
        )
      );

      const newCount: PromiseType<
        ReturnType<SpacedRepetitionModel['getNewCountByCategoryNames']>
      > = yield call(
        [this.spacedRepetitionModel, 'getNewCountByCategoryNames'],
        this.userDb,
        setId,
        categoryNames
      );

      const dueCount: PromiseType<
        ReturnType<SpacedRepetitionModel['getDueCountByCategoryNames']>
      > = yield call(
        [this.spacedRepetitionModel, 'getDueCountByCategoryNames'],
        this.userDb,
        setId,
        initialInterval,
        maxLevel,
        categoryNames
      );

      yield put(
        createAction(
          ActionType.MANAGE__FETCH_SPACED_REPETITION_DUE_AND_NEW_COUNTS_SUCCEEDED,
          _.fromPairs(
            categoryNames.map(
              (categoryName): [string, { due: number; new: number }] => {
                return [
                  categoryName,
                  {
                    due: dueCount[categoryName] || 0,
                    new: newCount[categoryName] || 0,
                  },
                ];
              }
            )
          )
        )
      );
    } catch (error) {
      yield put(
        createAction(
          ActionType.MANAGE__FETCH_SPACED_REPETITION_DUE_AND_NEW_COUNTS_FAILED,
          {
            errorCode: errorConverter.getErrorCode(error),
            error,
          }
        )
      );
    }
  }

  public *allowFetchWritingDueAndNewCounts(
    maxLevel: number
  ): IterableIterator<any> {
    while (true) {
      const action = yield take(
        ActionType.MANAGE__FETCH_WRITING_DUE_AND_NEW_COUNTS
      );
      const { setId, initialInterval, categoryNames } = action.payload;

      yield fork(
        [this, this.fetchWritingDueAndNewCounts],
        setId,
        maxLevel,
        initialInterval,
        categoryNames
      );
    }
  }

  public *fetchWritingDueAndNewCounts(
    setId: string,
    maxLevel: number,
    initialInterval: number,
    categoryNames: string[]
  ): IterableIterator<any> {
    try {
      yield put(
        createAction(
          ActionType.MANAGE__FETCHING_WRITING_DUE_AND_NEW_COUNTS,
          null
        )
      );

      const newCount: PromiseType<
        ReturnType<WritingModel['getNewCountByCategoryNames']>
      > = yield call(
        [this.writingModel, 'getNewCountByCategoryNames'],
        this.userDb,
        setId,
        categoryNames
      );

      const dueCount: PromiseType<
        ReturnType<WritingModel['getDueCountByCategoryNames']>
      > = yield call(
        [this.writingModel, 'getDueCountByCategoryNames'],
        this.userDb,
        setId,
        initialInterval,
        maxLevel,
        categoryNames
      );

      yield put(
        createAction(
          ActionType.MANAGE__FETCH_WRITING_DUE_AND_NEW_COUNTS_SUCCEEDED,
          _.fromPairs(
            categoryNames.map(
              (categoryName): [string, { due: number; new: number }] => {
                return [
                  categoryName,
                  {
                    due: dueCount[categoryName] || 0,
                    new: newCount[categoryName] || 0,
                  },
                ];
              }
            )
          )
        )
      );
    } catch (error) {
      yield put(
        createAction(
          ActionType.MANAGE__FETCH_WRITING_DUE_AND_NEW_COUNTS_FAILED,
          {
            errorCode: errorConverter.getErrorCode(error),
            error,
          }
        )
      );
    }
  }
}
