/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { UploadUserRequest, User } from '@ulangi/ulangi-common/interfaces';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import { DirtyUserModel, SessionModel } from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';
import { UploadUserSaga } from './UploadUserSaga';

const { SQLiteDatabase: SQLiteDatabaseMock } = jest.genMockFromModule(
  '@ulangi/sqlite-adapter'
);

const {
  SessionModel: SessionModelMock,
  DirtyUserModel: DirtyUserModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('UploadUserSaga', (): void => {
  const apiUrl = 'http://localhost';

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedDirtyUserModel: jest.Mocked<DirtyUserModel>;
    let uploadUserSaga: UploadUserSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedDirtyUserModel = new DirtyUserModelMock();

        uploadUserSaga = new UploadUserSaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedDirtyUserModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test uploadUser', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            uploadUserSaga.uploadUser.bind(uploadUserSaga),
            apiUrl
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('upload user success flow', async (): Promise<void> => {
        const accessToken = 'accessToken';
        const user: DeepPartial<User> = {
          userId: 'userId',
          updatedAt: moment().toDate(),
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 4,
                writingLevelThreshold: 4,
              },
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
              firstSyncedAt: null,
              lastSyncedAt: null,
            },
          ],
        };

        const markUserAsSynced = jest.fn();

        const response = {
          data: {
            success: true,
          },
        };

        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getUserId), user.userId],
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [
              matchers.call.fn(mockedDirtyUserModel.getDirtyUserForSyncing),
              {
                user: user,
                markUserAsSynced,
              },
            ],
            [matchers.call.fn(axios.request), response],
          ])
          .call([mockedSessionModel, 'getUserId'], mockedSharedDatabase)
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [mockedDirtyUserModel, 'getDirtyUserForSyncing'],
            mockedUserDatabase,
            user.userId,
            true
          )
          .put(
            createAction(ActionType.USER__UPLOADING_USER, {
              user: user,
            })
          )
          .call(
            [axios, 'request'],
            createRequest<UploadUserRequest>(
              'post',
              apiUrl,
              '/upload-user',
              null,
              { user: user },
              { accessToken }
            )
          )
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(ActionType.USER__UPLOAD_USER_SUCCEEDED, {
              noMore: false,
            })
          )
          .returns({ success: true, noMore: false })
          .run();

        expect(markUserAsSynced).toHaveBeenCalledWith(mockedTransaction);
      });

      test('no user to upload', async (): Promise<void> => {
        await saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getUserId), 'userId'],
            [
              matchers.call.fn(mockedSessionModel.getAccessToken),
              'accessToken',
            ],
            [
              matchers.call.fn(mockedDirtyUserModel.getDirtyUserForSyncing),
              { user: null },
            ],
          ])
          .call([mockedSessionModel, 'getUserId'], mockedSharedDatabase)
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [mockedDirtyUserModel, 'getDirtyUserForSyncing'],
            mockedUserDatabase,
            'userId',
            true
          )
          .put(
            createAction(ActionType.USER__UPLOADING_USER, {
              user: null,
            })
          )
          .put(
            createAction(ActionType.USER__UPLOAD_USER_SUCCEEDED, {
              noMore: true,
            })
          )
          .returns({ success: true, noMore: true })
          .run();
      });
    });
  });
});
