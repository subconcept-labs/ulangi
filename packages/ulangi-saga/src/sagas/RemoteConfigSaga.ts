/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  GetRemoteConfigRequest,
  RemoteConfig,
} from '@ulangi/ulangi-common/interfaces';
import { GetRemoteConfigResponseResolver } from '@ulangi/ulangi-common/resolvers';
import {
  DatabaseFacade,
  RemoteConfigModel,
} from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as moment from 'moment';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SagaEnv } from '../interfaces/SagaEnv';
import { PublicSaga } from '../sagas/PublicSaga';
import { createRequest } from '../utils/createRequest';

export class RemoteConfigSaga extends PublicSaga {
  private getRemoteConfigResponseResolver = new GetRemoteConfigResponseResolver();

  private database: DatabaseFacade;
  private remoteConfigModel: RemoteConfigModel;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    database: DatabaseFacade,
    remoteConfigModel: RemoteConfigModel,
    crashlytics: CrashlyticsAdapter
  ) {
    super();
    this.database = database;
    this.remoteConfigModel = remoteConfigModel;
    this.crashlytics = crashlytics;
  }

  public *run(env: SagaEnv): IterableIterator<any> {
    yield fork([this, this.allowFetch]);

    yield fork([this, this.allowUpdate], env.API_URL);
  }

  public *allowFetch(): IterableIterator<any> {
    while (true) {
      yield take(ActionType.REMOTE_CONFIG__FETCH);

      try {
        yield put(createAction(ActionType.REMOTE_CONFIG__FETCHING, null));

        const sharedDb = this.database.getDb('shared');

        const remoteConfig: PromiseType<
          ReturnType<RemoteConfigModel['getRemoteConfig']>
        > = yield call(
          [this.remoteConfigModel, 'getRemoteConfig'],
          sharedDb,
          true
        );

        yield put(
          createAction(ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED, {
            remoteConfig,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.REMOTE_CONFIG__FETCH_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  public *allowUpdate(apiUrl: string): IterableIterator<any> {
    while (true) {
      yield take(ActionType.REMOTE_CONFIG__UPDATE);

      try {
        yield put(createAction(ActionType.REMOTE_CONFIG__UPDATING, null));

        const remoteConfig = yield call([this, this.fetchFromServer], apiUrl);

        yield call([this, this.insertCacheIntoDb], remoteConfig);

        yield put(
          createAction(ActionType.REMOTE_CONFIG__UPDATE_SUCCEEDED, null)
        );
      } catch (error) {
        yield put(
          createAction(ActionType.REMOTE_CONFIG__UPDATE_FAILED, {
            errorCode: this.crashlytics.getErrorCode(error),
          })
        );
      }
    }
  }

  private *fetchFromServer(apiUrl: string): IterableIterator<any> {
    const response: AxiosResponse<any> = yield call(
      [axios, 'request'],
      createRequest<GetRemoteConfigRequest>(
        'get',
        apiUrl,
        '/get-remote-config',
        null,
        null,
        null
      )
    );

    return this.getRemoteConfigResponseResolver.resolve(response.data, true)
      .remoteConfig;
  }

  private *insertCacheIntoDb(
    remoteConfig: RemoteConfig
  ): IterableIterator<any> {
    const sharedDb = this.database.getDb('shared');
    yield call(
      [sharedDb, 'transaction'],
      (tx: Transaction): void => {
        this.remoteConfigModel.insertRemoteConfig(tx, remoteConfig);
        this.remoteConfigModel.insertLastFetchTime(tx, moment().unix());
      }
    );
  }
}
