/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { CategoryModel } from '@ulangi/ulangi-local-database';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { ProtectedSaga } from './ProtectedSaga';

export class CategorySaga extends ProtectedSaga {
  private fetchSuggestionsTask?: Task;

  private userDb: SQLiteDatabase;
  private categoryModel: CategoryModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    categoryModel: CategoryModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.userDb = userDb;
    this.categoryModel = categoryModel;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork(
      [this, this.allowPrepareAndClearFetchSuggestions],
      config.category.fetchSuggestionsLimit
    );
  }

  public *allowPrepareAndClearFetchSuggestions(
    limit: number
  ): IterableIterator<any> {
    this.fetchSuggestionsTask = yield fork(
      [this, this.allowPrepareFetchSuggestions],
      limit
    );
    yield fork([this, this.allowClearFetchSuggestions], limit);
  }

  private *allowClearFetchSuggestions(limit: number): IterableIterator<any> {
    while (true) {
      yield take(ActionType.CATEGORY__CLEAR_FETCH_SUGGESTIONS);
      if (typeof this.fetchSuggestionsTask !== 'undefined') {
        yield cancel(this.fetchSuggestionsTask);
      }

      this.fetchSuggestionsTask = yield fork(
        [this, this.allowPrepareFetchSuggestions],
        limit
      );
    }
  }

  private *allowPrepareFetchSuggestions(limit: number): IterableIterator<any> {
    try {
      const action: Action<
        ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS
      > = yield take(ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS);
      const { setId, term } = action.payload;

      yield put(
        createAction(ActionType.CATEGORY__PREPARING_FETCH_SUGGESTIONS, null)
      );

      yield fork([this, this.allowFetchSuggestions], setId, term, limit);

      yield put(
        createAction(
          ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS_SUCCEEDED,
          null
        )
      );
    } catch (error) {
      yield put(
        createAction(ActionType.CATEGORY__PREPARE_FETCH_SUGGESTIONS_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }

  private *allowFetchSuggestions(
    setId: string,
    term: string,
    limit: number
  ): IterableIterator<any> {
    let offset = 0;
    while (true) {
      yield take(ActionType.CATEGORY__FETCH_SUGGESTIONS);

      try {
        yield put(
          createAction(ActionType.CATEGORY__FETCHING_SUGGESTIONS, null)
        );

        const result: PromiseType<
          ReturnType<CategoryModel['getCategoryNameSuggestions']>
        > = yield call(
          [this.categoryModel, 'getCategoryNameSuggestions'],
          this.userDb,
          setId,
          term,
          limit,
          offset
        );

        const { categoryNames } = result;

        offset += categoryNames.length;

        const noMore = categoryNames.length === 0 ? true : false;

        yield put(
          createAction(ActionType.CATEGORY__FETCH_SUGGESTIONS_SUCCEEDED, {
            categoryNames,
            noMore,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.CATEGORY__FETCH_SUGGESTIONS_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }
}
