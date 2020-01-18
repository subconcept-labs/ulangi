/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { DatabaseFacade } from '@ulangi/ulangi-local-database';
import { call, cancel, delay, fork, put, take } from 'redux-saga/effects';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { PublicSaga } from '../sagas/PublicSaga';

export class DatabaseSaga extends PublicSaga {
  private database: DatabaseFacade;

  public constructor(database: DatabaseFacade) {
    super();
    this.database = database;
  }

  public *run(_: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.allowConnectSharedDb]);
    yield fork([this, this.allowCheckSharedDb]);
    yield fork([this, this.allowConnectUserDb]);
    yield fork(
      [this, this.allowCheckUserDb],
      config.general.checkDatabaseTimeout
    );
  }

  public *allowConnectSharedDb(): IterableIterator<any> {
    yield take(ActionType.DATABASE__CONNECT_SHARED_DB);
    try {
      yield put(createAction(ActionType.DATABASE__CONNECTING_SHARED_DB, null));
      yield call([this.database, 'connectSharedDb'], 'shared');
      yield put(
        createAction(ActionType.DATABASE__CONNECT_SHARED_DB_SUCCEEDED, null)
      );

      // Avoid connecting shared db again
      while (true) {
        yield take(ActionType.DATABASE__CONNECT_SHARED_DB);
        yield put(
          createAction(ActionType.DATABASE__ALREADY_CONNECTED_SHARED_DB, null)
        );
      }
    } catch (error) {
      yield put(
        createAction(ActionType.DATABASE__CONNECT_SHARED_DB_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
    }
  }

  public *allowCheckSharedDb(): IterableIterator<any> {
    yield take(ActionType.DATABASE__CHECK_SHARED_DB);
    try {
      yield put(createAction(ActionType.DATABASE__CHECKING_SHARED_DB, null));
      yield call([this.database, 'checkSharedDb']);
      yield put(
        createAction(ActionType.DATABASE__CHECK_SHARED_DB_SUCCEEDED, null)
      );

      // Avoid checking shared db again
      while (true) {
        yield take(ActionType.DATABASE__CHECK_SHARED_DB);
        yield put(
          createAction(ActionType.DATABASE__ALREADY_CHECKED_SHARED_DB, null)
        );
      }
    } catch (error) {
      yield put(
        createAction(ActionType.DATABASE__CHECK_SHARED_DB_FAILED, {
          errorCode: errorConverter.getErrorCode(error),
          error,
        })
      );
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
            errorCode: errorConverter.getErrorCode(error),
            error,
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
            errorCode: errorConverter.getErrorCode(error),
            error,
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
