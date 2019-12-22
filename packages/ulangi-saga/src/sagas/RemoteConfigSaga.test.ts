/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  GetRemoteConfigRequest,
  RemoteConfig,
} from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  DatabaseFacade,
  RemoteConfigModel,
} from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';
import { RemoteConfigSaga } from './RemoteConfigSaga';

jest.mock('axios');

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  DatabaseFacade: DatabaseFacadeMock,
  RemoteConfigModel: RemoteConfigModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('RemoteConfigSaga', (): void => {
  const apiUrl = 'http://localhost/api';

  describe('Tests start with all mocked modules', (): void => {
    let mockedDatabaseFacade: jest.Mocked<DatabaseFacade>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedRemoteConfigModel: jest.Mocked<RemoteConfigModel>;
    let remoteConfigSaga: RemoteConfigSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedDatabaseFacade = new DatabaseFacadeMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedRemoteConfigModel = new RemoteConfigModelMock();

        mockedDatabaseFacade.getDb = jest.fn<any>(
          (): SQLiteDatabase => mockedSharedDatabase
        );
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        remoteConfigSaga = new RemoteConfigSaga(
          mockedDatabaseFacade,
          mockedRemoteConfigModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test allowFetch', (): void => {
      let restoreCurrentTime: () => void;

      beforeEach(
        (): void => {
          saga = expectSaga(remoteConfigSaga.allowFetch.bind(remoteConfigSaga));
          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('fetch from cache', async (): Promise<void> => {
        const cachedRemoteConfig = {
          languages: [],
          supportedLanguagePairs: [],
          app: {
            showInAppRatingAfterDays: 15,
          },
          sync: {
            uploadLimit: 60,
            downloadLimit: 40,
            minDelay: 100,
            maxDelay: 300,
            incrementDelayOnError: 100,
          },
          ad: {
            numOfTermsToReviewBeforeShowingAds: 40,
          },
        };

        await saga
          .provide([
            [
              matchers.call.fn(mockedRemoteConfigModel.getRemoteConfig),
              cachedRemoteConfig,
            ],
          ])
          .dispatch(createAction(ActionType.REMOTE_CONFIG__FETCH, null))
          .put(createAction(ActionType.REMOTE_CONFIG__FETCHING, null))
          .call(
            [mockedRemoteConfigModel, 'getRemoteConfig'],
            mockedSharedDatabase,
            true
          )
          .put(
            createAction(ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED, {
              remoteConfig: cachedRemoteConfig,
            })
          )
          .silentRun();
      });
    });

    describe('Test allowUpdate', (): void => {
      let restoreCurrentTime: () => void;

      beforeEach(
        (): void => {
          saga = expectSaga(
            remoteConfigSaga.allowUpdate.bind(remoteConfigSaga),
            apiUrl
          );
          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('update from server', async (): Promise<void> => {
        const remoteConfig: RemoteConfig = {
          languages: [],
          supportedLanguagePairs: [],
          app: {
            showInAppRatingAfterDays: 15,
          },
          sync: {
            uploadLimit: 60,
            downloadLimit: 40,
            minDelay: 100,
            maxDelay: 300,
            incrementDelayOnError: 100,
          },
          ad: {
            numOfTermsToReviewBeforeShowingAds: 40,
          },
        };

        const response = {
          data: {
            remoteConfig,
          },
        };

        await saga
          .provide([[matchers.call.fn(axios.request), response]])
          .dispatch(createAction(ActionType.REMOTE_CONFIG__UPDATE, null))
          .put(createAction(ActionType.REMOTE_CONFIG__UPDATING, null))
          .call(
            [axios, 'request'],
            createRequest<GetRemoteConfigRequest>(
              'get',
              apiUrl,
              '/get-remote-config',
              null,
              null,
              null
            )
          )
          .put(createAction(ActionType.REMOTE_CONFIG__UPDATE_SUCCEEDED, null))
          .silentRun();

        expect(mockedRemoteConfigModel.insertRemoteConfig).toHaveBeenCalledWith(
          mockedTransaction,
          remoteConfig
        );

        expect(
          mockedRemoteConfigModel.insertLastFetchTime
        ).toHaveBeenCalledWith(mockedTransaction, moment().unix());
      });
    });
  });
});
