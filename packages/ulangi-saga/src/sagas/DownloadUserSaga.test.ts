/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserBuilder } from '@ulangi/ulangi-common/builders';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { DownloadUserRequest } from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import { SessionModel, UserModel } from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { createRequest } from '../utils/createRequest';
import { DownloadUserSaga } from './DownloadUserSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  UserModel: UserModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('DownloadUserSaga', (): void => {
  const apiUrl = 'http://localhost';

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedUserModel: jest.Mocked<UserModel>;
    let downloadUserSaga: DownloadUserSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedUserModel = new UserModelMock();

        downloadUserSaga = new DownloadUserSaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedUserModel
        );
      }
    );

    describe('Test downloadUser', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            downloadUserSaga.downloadUser.bind(downloadUserSaga),
            apiUrl
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('download user success flow', async (): Promise<void> => {
        const accessToken = 'accessToken';
        const user = new UserBuilder().build({
          email: 'email@ulangi.com',
          firstSyncedAt: moment().toDate(),
          lastSyncedAt: moment().toDate(),
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 4,
                writingLevelThreshold: 4,
              },
              firstSyncedAt: moment().toDate(),
              lastSyncedAt: moment().toDate(),
            },
          ],
        });
        const response = {
          data: {
            user,
          },
        };

        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
          ])
          .put(createAction(ActionType.USER__DOWNLOADING_USER, null))
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [axios, 'request'],
            createRequest<DownloadUserRequest>(
              'get',
              apiUrl,
              '/download-user',
              null,
              null,
              { accessToken }
            )
          )
          .call.fn(mockedUserDatabase.transaction)
          .put(createAction(ActionType.USER__DOWNLOAD_USER_SUCCEEDED, null))
          .returns({ success: true, noMore: true })
          .run();

        expect(mockedUserModel.updateUser).toHaveBeenCalledWith(
          mockedTransaction,
          user,
          'remote'
        );
      });
    });
  });
});
