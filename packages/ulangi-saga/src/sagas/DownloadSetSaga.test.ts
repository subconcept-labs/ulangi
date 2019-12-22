/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common';
import {
  SetBuilder,
  SetExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { DownloadSetsRequest, Set } from '@ulangi/ulangi-common/interfaces';
import { SetResolver } from '@ulangi/ulangi-common/resolvers';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  IncompatibleSetModel,
  SessionModel,
  SetModel,
} from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { createRequest } from '../utils/createRequest';
import { DownloadSetSaga } from './DownloadSetSaga';

const {
  SQLiteDatabase: SQLiteDatabaseMock,
  Transaction: TransactionMock,
} = jest.genMockFromModule('@ulangi/sqlite-adapter');

const {
  SessionModel: SessionModelMock,
  SetModel: SetModelMock,
  IncompatibleSetModel: IncompatibleSetModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('DownloadSetSaga', (): void => {
  const apiUrl = 'http://localhost';
  const downloadLimit = 20;
  const transactionChunkSize = 4;
  const delayBetweenChunks = 500;

  describe('Tests start with all mocked modules', (): void => {
    let mockedTransaction: jest.Mocked<Transaction>;
    let mockedUserDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSharedDatabase: jest.Mocked<SQLiteDatabase>;
    let mockedSessionModel: jest.Mocked<SessionModel>;
    let mockedSetModel: jest.Mocked<SetModel>;
    let mockedIncompatibleSetModel: jest.Mocked<IncompatibleSetModel>;
    let downloadSetSaga: DownloadSetSaga;
    let saga: ExpectApi;

    beforeEach(
      (): void => {
        mockedTransaction = new TransactionMock();
        mockedUserDatabase = new SQLiteDatabaseMock();
        mockedSharedDatabase = new SQLiteDatabaseMock();
        mockedUserDatabase.transaction = mockTransaction(mockedTransaction);
        mockedSharedDatabase.transaction = mockTransaction(mockedTransaction);

        mockedSetModel = new SetModelMock();
        mockedSessionModel = new SessionModelMock();
        mockedIncompatibleSetModel = new IncompatibleSetModelMock();

        downloadSetSaga = new DownloadSetSaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedSetModel,
          mockedIncompatibleSetModel,
          new CrashlyticsAdapter(null, false)
        );
      }
    );

    describe('Test downloadSets', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            downloadSetSaga.downloadSets.bind(downloadSetSaga),
            apiUrl,
            downloadLimit,
            transactionChunkSize,
            delayBetweenChunks
          );
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      test('download set success flow', async (): Promise<void> => {
        const latestSyncTime = moment().toDate();
        const accessToken = 'accessToken';
        const noMore = false;

        const compatibleSets = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'set' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'vi',
                extraData: [
                  new SetExtraDataItemBuilder().build({
                    dataName:
                      SetExtraDataName.SPACED_REPETITION_INITIAL_INTERVAL,
                    dataValue: 12,
                  }),
                ],
              });
            }
          );
        const incompatibleSets = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'set with unknown props' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'vi',
                unknownProps: 'test',
              } as any);
            }
          );
        const unresolvedSetList = [...compatibleSets, ...incompatibleSets];

        const response = {
          data: {
            setList: unresolvedSetList,
            noMore,
          },
        };

        const allSets = new SetResolver().resolveArray(
          response.data.setList,
          true
        );

        const toBeInsertedSets = _.sortBy(allSets, 'lastSyncedAt');

        //Assume that sets with even index exist
        const existingSetIds = toBeInsertedSets
          .filter((_, index): boolean => index % 2 === 0)
          .map((set): string => set.setId);

        const chunks = _.chunk(toBeInsertedSets, transactionChunkSize);

        saga
          .provide([
            [
              matchers.call.fn(mockedSetModel.getLatestSyncTime),
              latestSyncTime,
            ],
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [matchers.call.fn(axios.request), response],
            [matchers.call.fn(mockedSetModel.setIdsExist), existingSetIds],
          ])
          .call([mockedSetModel, 'getLatestSyncTime'], mockedUserDatabase)
          .put(
            createAction(ActionType.SET__DOWNLOADING_SETS, {
              startAt: latestSyncTime,
            })
          )
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call(
            [axios, 'request'],
            createRequest<DownloadSetsRequest>(
              'get',
              apiUrl,
              '/download-sets',
              {
                startAt: latestSyncTime,
                softLimit: downloadLimit,
              },
              null,
              { accessToken }
            )
          )
          .call(
            [mockedSetModel, 'setIdsExist'],
            mockedUserDatabase,
            toBeInsertedSets.map((set): string => set.setId)
          );

        chunks.forEach(
          (): void => {
            saga.call
              .fn(mockedUserDatabase.transaction)
              .delay(delayBetweenChunks);
          }
        );

        await saga
          .put(
            createAction(ActionType.SET__DOWNLOAD_SETS_SUCCEEDED, {
              setList: toBeInsertedSets,
              noMore,
            })
          )
          .returns({ success: true, noMore })
          .run(10000);

        chunks.forEach(
          (chunk, index): void => {
            expect(mockedSetModel.insertSets).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              chunk.filter(
                (set): boolean => !_.includes(existingSetIds, set.setId)
              ),
              'remote'
            );
            expect(mockedSetModel.updateSets).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              chunk.filter(
                (set): boolean => _.includes(existingSetIds, set.setId)
              ),
              'remote'
            );
            expect(
              mockedIncompatibleSetModel.upsertIncompatibleSets
            ).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              incompatibleSets
                .filter(
                  (set): boolean =>
                    _.includes(chunk.map((set): string => set.setId), set.setId)
                )
                .map((set): string => set.setId),
              currentComparableCommonVersion
            );
          }
        );
      });
    });
  });
});
