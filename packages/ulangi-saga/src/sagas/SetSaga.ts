/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { SetModel } from '@ulangi/ulangi-local-database';
import {
  ForkEffect,
  call,
  fork,
  put,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { ProtectedSaga } from './ProtectedSaga';

export class SetSaga extends ProtectedSaga {
  private userDb: SQLiteDatabase;
  private setModel: SetModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    userDb: SQLiteDatabase,
    setModel: SetModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.userDb = userDb;
    this.setModel = setModel;
    this.crashlytics = crashlytics;
  }

  public *run(): IterableIterator<any> {
    yield fork([this, this.allowAdd]);
    yield fork([this, this.allowEdit]);
    yield fork([this, this.allowFetchAll]);
    yield fork([this, this.allowFetch]);
  }

  public *allowAdd(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.SET__ADD> = yield take(
        ActionType.SET__ADD
      );
      const { set } = action.payload;

      try {
        yield put(createAction(ActionType.SET__ADDING, { set }));

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.setModel.insertSet(tx, set, 'local');
          }
        );

        yield put(createAction(ActionType.SET__ADD_SUCCEEDED, { set }));
      } catch (error) {
        yield put(
          createAction(ActionType.SET__ADD_FAILED, {
            set,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowEdit(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.SET__EDIT> = yield take(
        ActionType.SET__EDIT
      );
      const { set } = action.payload;

      try {
        yield put(createAction(ActionType.SET__EDITING, { set }));

        const setId = assertExists(
          set.setId,
          'setId should not be null or undefined'
        );

        yield call(
          [this.userDb, 'transaction'],
          (tx: Transaction): void => {
            this.setModel.updateSet(tx, set, 'local');
          }
        );

        const result: PromiseType<
          ReturnType<SetModel['getSetById']>
        > = yield call(
          [this.setModel, 'getSetById'],
          this.userDb,
          setId,
          false
        );

        const { set: updatedSet } = assertExists(result);
        yield put(
          createAction(ActionType.SET__EDIT_SUCCEEDED, { set: updatedSet })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.SET__EDIT_FAILED, {
            set,
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowFetchAll(): IterableIterator<any> {
    while (true) {
      yield take(ActionType.SET__FETCH_ALL);

      try {
        yield put(createAction(ActionType.SET__FETCHING_ALL, null));

        const result: PromiseType<
          ReturnType<SetModel['getAllSets']>
        > = yield call([this.setModel, 'getAllSets'], this.userDb, true);

        const { setList } = result;

        yield put(
          createAction(ActionType.SET__FETCH_ALL_SUCCEEDED, { setList })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.SET__FETCH_ALL_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowFetch(): IterableIterator<any> {
    yield takeEvery(
      ActionType.SET__FETCH,
      (action: Action<ActionType.SET__FETCH>): IterableIterator<ForkEffect> =>
        this.fetch(action)
    );
  }

  private *fetch(action: Action<ActionType.SET__FETCH>): IterableIterator<any> {
    const { setStatus } = action.payload;

    try {
      yield put(createAction(ActionType.SET__FETCHING, { setStatus }));

      const result: PromiseType<
        ReturnType<SetModel['getSetsByStatus']>
      > = yield call(
        [this.setModel, 'getSetsByStatus'],
        this.userDb,
        setStatus,
        true
      );

      const { setList } = result;

      yield put(
        createAction(ActionType.SET__FETCH_SUCCEEDED, {
          setList,
          setStatus,
        })
      );
    } catch (error) {
      yield put(
        createAction(ActionType.SET__FETCH_FAILED, {
          setStatus,
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }
}
