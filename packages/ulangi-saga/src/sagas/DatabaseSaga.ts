/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { DatabaseFacade } from '@ulangi/ulangi-local-database';
import { call, cancel, delay, fork, put, take } from 'redux-saga/effects';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { PublicSaga } from '../sagas/PublicSaga';

export class DatabaseSaga extends PublicSaga {
  private database: DatabaseFacade;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    database: DatabaseFacade,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.database = database;
    this.crashlytics = crashlytics;
  }

  public *run(config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowConnectSharedDb]);
    yield fork([this, this.allowCheckSharedDb]);
    yield fork([this, this.allowConnectUserDb]);
    yield fork(
      [this, this.allowCheckUserDb],
      config.general.checkDatabaseTimeout
    );
  }

  public *allowConnectSharedDb(): IterableIterator<any> {
    while (true) {
      yield take(ActionType.DATABASE__CONNECT_SHARED_DB);
      try {
        yield put(
          createAction(ActionType.DATABASE__CONNECTING_SHARED_DB, null)
        );
        yield call([this.database, 'connectSharedDb'], 'shared');
        yield put(
          createAction(ActionType.DATABASE__CONNECT_SHARED_DB_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DATABASE__CONNECT_SHARED_DB_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowCheckSharedDb(): IterableIterator<any> {
    while (true) {
      yield take(ActionType.DATABASE__CHECK_SHARED_DB);
      try {
        yield put(createAction(ActionType.DATABASE__CHECKING_SHARED_DB, null));
        yield call([this.database, 'checkSharedDb']);
        yield put(
          createAction(ActionType.DATABASE__CHECK_SHARED_DB_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DATABASE__CHECK_SHARED_DB_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowConnectUserDb(): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.DATABASE__CONNECT_USER_DB> = yield take(
        ActionType.DATABASE__CONNECT_USER_DB
      );
      const { userId } = action.payload;

      try {
        yield put(createAction(ActionType.DATABASE__CONNECTING_USER_DB, null));
        yield call([this.database, 'connectUserDb'], userId);
        yield put(
          createAction(ActionType.DATABASE__CONNECT_USER_DB_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DATABASE__CONNECT_USER_DB_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowCheckUserDb(timeout: number): IterableIterator<any> {
    while (true) {
      yield take(ActionType.DATABASE__CHECK_USER_DB);
      try {
        yield put(createAction(ActionType.DATABASE__CHECKING_USER_DB, null));

        const waitTask = yield fork(
          [this, this.waitForCheckingUserDb],
          timeout
        );
        yield call([this.database, 'checkUserDb']);
        yield cancel(waitTask);

        yield put(
          createAction(ActionType.DATABASE__CHECK_USER_DB_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DATABASE__CHECK_USER_DB_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  private *waitForCheckingUserDb(timeout: number): IterableIterator<any> {
    yield delay(timeout);
    yield put(
      createAction(ActionType.DATABASE__CHECK_USER_DB_TIMEOUT_EXCEEDED, null)
    );
  }
}
