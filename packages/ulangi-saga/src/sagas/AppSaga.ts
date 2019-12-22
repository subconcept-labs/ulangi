/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { fork, put, take } from 'redux-saga/effects';

import { PublicSaga } from './PublicSaga';

export class AppSaga extends PublicSaga {
  public *run(): IterableIterator<any> {
    yield fork([this, this.allowInitialize]);
  }

  public *allowInitialize(): IterableIterator<any> {
    yield take(ActionType.APP__INITIALIZE);

    yield put(createAction(ActionType.APP__INITIALIZING, null));

    yield put(createAction(ActionType.NETWORK__CHECK_CONNECTION, null));

    yield put(
      createAction(ActionType.NETWORK__OBSERVE_CONNECTION_CHANGE, null)
    );

    yield put(createAction(ActionType.DATABASE__CONNECT_SHARED_DB, null));
    yield take(ActionType.DATABASE__CONNECT_SHARED_DB_SUCCEEDED);

    yield put(createAction(ActionType.DATABASE__CHECK_SHARED_DB, null));
    yield take(ActionType.DATABASE__CHECK_SHARED_DB_SUCCEEDED);

    yield put(createAction(ActionType.APP__INITIALIZE_SUCCEEDED, null));
  }
}
