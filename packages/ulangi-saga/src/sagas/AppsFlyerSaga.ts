/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { call, put, take } from 'redux-saga/effects';

import { AppsFlyerAdapter } from '../adapters/AppsFlyerAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { PublicSaga } from './PublicSaga';

export class AppsFlyerSaga extends PublicSaga {
  private appsFlyer: AppsFlyerAdapter;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    appsFlyer: AppsFlyerAdapter,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.appsFlyer = appsFlyer;
    this.crashlytics = crashlytics;
  }

  public *run(): IterableIterator<any> {
    yield call([this, this.allowInitSdk]);
  }

  public *allowInitSdk(): IterableIterator<any> {
    try {
      const action: Action<ActionType.APPS_FLYER__INIT_SDK> = yield take(
        ActionType.APPS_FLYER__INIT_SDK
      );

      yield call([this.appsFlyer, 'initSdk'], action.payload);

      yield put(createAction(ActionType.APPS_FLYER__INIT_SDK_SUCCEEDED, null));
    } catch (error) {
      yield put(
        createAction(ActionType.APPS_FLYER__INIT_SDK_FAILED, {
          errorCode: this.crashlytics.getErrorCode(error),
        })
      );
    }
  }
}
