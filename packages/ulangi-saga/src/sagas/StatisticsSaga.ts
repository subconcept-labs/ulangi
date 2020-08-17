/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase } from '@ulangi/sqlite-adapter';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import {
  GetHeatMapDataRequest,
  GetStatisticsRequest,
} from '@ulangi/ulangi-common/interfaces';
import {
  GetHeatMapDataResponseResolver,
  GetStatisticsResponseResolver,
} from '@ulangi/ulangi-common/resolvers';
import { SessionModel } from '@ulangi/ulangi-local-database';
import axios, { AxiosResponse } from 'axios';
import * as moment from 'moment';
import { call, fork, put, take } from 'redux-saga/effects';
import { PromiseType } from 'utility-types';

import { errorConverter } from '../converters/ErrorConverter';
import { SagaEnv } from '../interfaces/SagaEnv';
import { createRequest } from '../utils/createRequest';
import { ProtectedSaga } from './ProtectedSaga';

export class StatisticsSaga extends ProtectedSaga {
  private getStatisticsResponseResolver = new GetStatisticsResponseResolver();
  private getHeatMapDataResponseResolver = new GetHeatMapDataResponseResolver();

  private sharedDb: SQLiteDatabase;
  private sessionModel: SessionModel;

  public constructor(sharedDb: SQLiteDatabase, sessionModel: SessionModel) {
    super();
    this.sharedDb = sharedDb;
    this.sessionModel = sessionModel;
  }

  public *run(env: SagaEnv): IterableIterator<any> {
    yield fork([this, this.allowGetStatistics], env.API_URL);

    yield fork([this, this.allowGetHeatMapData], env.API_URL);
  }

  public *allowGetStatistics(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        yield take(ActionType.STATISTICS__GET_STATISTICS);

        yield put(
          createAction(ActionType.STATISTICS__GETTING_STATISTICS, null)
        );

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<GetStatisticsRequest>(
            'get',
            apiUrl,
            '/get-statistics',
            {
              currentLocalTime: moment().toDate(),
            },
            null,
            { accessToken: assertExists(accessToken) }
          )
        );

        const { statistics } = this.getStatisticsResponseResolver.resolve(
          response.data,
          true
        );

        yield put(
          createAction(ActionType.STATISTICS__GET_STATISTICS_SUCCEEDED, {
            statistics,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.STATISTICS__GET_STATISTICS_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }

  public *allowGetHeatMapData(apiUrl: string): IterableIterator<any> {
    while (true) {
      try {
        const action: Action<
          ActionType.STATISTICS__GET_HEAT_MAP_DATA
        > = yield take(ActionType.STATISTICS__GET_HEAT_MAP_DATA);

        const { startDate, endDate } = action.payload;

        yield put(
          createAction(ActionType.STATISTICS__GETTING_HEAT_MAP_DATA, null)
        );

        const accessToken: PromiseType<
          ReturnType<SessionModel['getAccessToken']>
        > = yield call([this.sessionModel, 'getAccessToken'], this.sharedDb);

        const response: AxiosResponse<any> = yield call(
          [axios, 'request'],
          createRequest<GetHeatMapDataRequest>(
            'get',
            apiUrl,
            '/get-heat-map-data',
            {
              startDate,
              endDate,
            },
            null,
            { accessToken: assertExists(accessToken) }
          )
        );

        const { data } = this.getHeatMapDataResponseResolver.resolve(
          response.data,
          true
        );

        yield put(
          createAction(ActionType.STATISTICS__GET_HEAT_MAP_DATA_SUCCEEDED, {
            data,
          })
        );
      } catch (error) {
        yield put(
          createAction(ActionType.STATISTICS__GET_HEAT_MAP_DATA_FAILED, {
            errorCode: errorConverter.getErrorCode(error),
            error,
          })
        );
      }
    }
  }
}
