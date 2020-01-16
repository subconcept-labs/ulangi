/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { call, fork, put, take } from 'redux-saga/effects';

import { AnalyticsAdapter } from '../adapters/AnalyticsAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { FacebookAdapter } from '../adapters/FacebookAdapter';
import { errorConverter } from '../converters/ErrorConverter';
import { PublicSaga } from './PublicSaga';

export class DataSharingSaga extends PublicSaga {
  private analytics: AnalyticsAdapter;
  private crashlytics: CrashlyticsAdapter;
  private facebook: FacebookAdapter;

  public constructor(
    analytics: AnalyticsAdapter,
    crashlytics: CrashlyticsAdapter,
    facebook: FacebookAdapter
  ) {
    super();
    this.analytics = analytics;
    this.crashlytics = crashlytics;
    this.facebook = facebook;
  }

  public *run(): IterableIterator<any> {
    yield fork([this, this.allowEnableAnalytics]);
    yield fork([this, this.allowDisableAnalytics]);
  }

  public *allowEnableAnalytics(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.DATA_SHARING__ENABLE_ANALYTICS);

        yield put(
          createAction(ActionType.DATA_SHARING__ENABLING_ANALYTICS, null)
        );

        yield call([this.crashlytics, 'enableCrashlyticsCollection']);
        yield call([this.analytics, 'setAnalyticsCollectionEnabled'], true);
        yield call([this.facebook, 'setAutoLogAppEventsEnabled'], true);

        yield put(
          createAction(
            ActionType.DATA_SHARING__ENABLE_ANALYTICS_SUCCEEDED,
            null
          )
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DATA_SHARING__ENABLE_ANALYTICS_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowDisableAnalytics(): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.DATA_SHARING__DISABLE_ANALYTICS);

        yield put(
          createAction(ActionType.DATA_SHARING__DISABLING_ANALYTICS, null)
        );

        yield call([this.analytics, 'setAnalyticsCollectionEnabled'], false);
        yield call([this.facebook, 'setAutoLogAppEventsEnabled'], false);

        yield put(
          createAction(
            ActionType.DATA_SHARING__DISABLE_ANALYTICS_SUCCEEDED,
            null
          )
        );
      } catch (error) {
        yield put(
          createAction(ActionType.DATA_SHARING__DISABLE_ANALYTICS_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
