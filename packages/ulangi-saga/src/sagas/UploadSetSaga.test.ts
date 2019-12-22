/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { SetBuilder } from '@ulangi/ulangi-common/builders';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { Set, UploadSetsRequest } from '@ulangi/ulangi-common/interfaces';
import { mockTransaction } from '@ulangi/ulangi-common/testing-utils';
import { DirtySetModel, SessionModel } from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';
import { UploadSetSaga } from './UploadSetSaga';

const {
  SQLiteDatabase: SQLiteDatabaseMock,
  Transaction: TransactionMock,
} = jest.genMockFromModule('@ulangi/sqlite-adapter');

const {
  SessionModel: SessionModelMock,
  DirtySetModel: DirtySetModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('UploadSetSaga', (): void => {
  const apiUrl = 'http://localhost';
  const uploadLimit = 10;

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedDirtySetModel: jest.Mocked<DirtySetModel>;
    let uploadSetSaga: UploadSetSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedTransaction = new TransactionMock();
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSessionModel = new SessionModelMock();
        mockedDirtySetModel = new DirtySetModelMock();

        uploadSetSaga = new UploadSetSaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedDirtySetModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test uploadSets', (): void => {
      beforeEach(
        (): void => {
          saga = expectSaga(
            uploadSetSaga.uploadSets.bind(uploadSetSaga),
            apiUrl,
            uploadLimit
          );
        }
      );

      test('upload set success flow', async (): Promise<void> => {
        const setList = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'set' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'en',
                extraData: [
                  {
                    dataName:
                      SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
                    dataValue: 12,
                    createdAt: moment().toDate(),
                    updatedAt: moment().toDate(),
                    firstSyncedAt: null,
                    lastSyncedAt: null,
                  },
                ],
              });
            }
          );

        const markSetsAsSynced = jest.fn();

        const acknowledgedSetIds = setList
          .filter((_, index): boolean => index % 3 === 0)
          .map((set): string => set.setId);

        const response = {
          data: {
            acknowledged: acknowledgedSetIds,
          },
        };

        const accessToken = 'accessToken';
        const stripUnknown = true;

        await saga
          .provide([
            [
              matchers.call.fn(mockedDirtySetModel.getDirtySetsForSyncing),
              {
                setList,
                markSetsAsSynced,
              },
            ],
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
          ])
          .call(
            [mockedDirtySetModel, 'getDirtySetsForSyncing'],
            mockedUserDatabase,
            uploadLimit,
            stripUnknown
          )
          .put(createAction(ActionType.SET__UPLOADING_SETS, { setList }))
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [axios, 'request'],
            createRequest<UploadSetsRequest>(
              'post',
              apiUrl,
              '/upload-sets',
              null,
              { setList },
              { accessToken }
            )
          )
          .call.fn(mockedUserDatabase.transaction)
          .put(
            createAction(ActionType.SET__UPLOAD_SETS_SUCCEEDED, {
              noMore: false,
            })
          )
          .run();

        expect(markSetsAsSynced).toHaveBeenCalledWith(
          mockedTransaction,
          acknowledgedSetIds
        );
      });

      it('return noMore = true if no more to upload', async (): Promise<
        void
      > => {
        const setList: any[] = [];
        const markSetsAsSynced = jest.fn();

        const accessToken = 'accessToken';
        const stripUnknown = true;

        await saga
          .provide([
            [
              matchers.call.fn(mockedDirtySetModel.getDirtySetsForSyncing),
              { setList, markSetsAsSynced },
            ],
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
          ])
          .call(
            [mockedDirtySetModel, 'getDirtySetsForSyncing'],
            mockedUserDatabase,
            uploadLimit,
            stripUnknown
          )
          .put(createAction(ActionType.SET__UPLOADING_SETS, { setList }))
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .put(
            createAction(ActionType.SET__UPLOAD_SETS_SUCCEEDED, {
              noMore: true,
            })
          )
          .run();
      });
    });
  });
});
