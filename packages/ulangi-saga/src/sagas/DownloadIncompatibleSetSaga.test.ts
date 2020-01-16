/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  SQLiteDatabase,
  SQLiteDatabaseAdapter,
  Transaction,
} from '@ulangi/sqlite-adapter';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { currentComparableCommonVersion } from '@ulangi/ulangi-common/';
import { SetBuilder } from '@ulangi/ulangi-common/builders';
import {
  DownloadSpecificSetsRequest,
  Set,
} from '@ulangi/ulangi-common/interfaces';
import { SetResolver } from '@ulangi/ulangi-common/resolvers';
import {
  mockCurrentTime,
  mockTransaction,
} from '@ulangi/ulangi-common/testing-utils';
import {
  DatabaseEventBus,
  DatabaseFacade,
  IncompatibleSetModel,
  ModelFactory,
  SessionModel,
  SetModel,
} from '@ulangi/ulangi-local-database';
import axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ExpectApi, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { createRequest } from '../utils/createRequest';
import { DownloadIncompatibleSetSaga } from './DownloadIncompatibleSetSaga';

const {
  SQLiteDatabase: SQLiteDatabaseMock,
  Transaction: TransactionMock,
} = jest.genMockFromModule('@ulangi/sqlite-adapter');

const {
  SessionModel: SessionModelMock,
  SetModel: SetModelMock,
  IncompatibleSetModel: IncompatibleSetModelMock,
} = jest.genMockFromModule('@ulangi/ulangi-local-database');

describe('DownloadIncompatibleSetSaga', (): void => {
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
    let downloadIncompatibleSetSaga: DownloadIncompatibleSetSaga;
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

        downloadIncompatibleSetSaga = new DownloadIncompatibleSetSaga(
          mockedUserDatabase,
          mockedSharedDatabase,
          mockedSessionModel,
          mockedSetModel,
          mockedIncompatibleSetModel
        );
      }
    );

    describe('Test downloadIncompatibleSets', (): void => {
      let restoreCurrentTime: () => void;
      beforeEach(
        (): void => {
          restoreCurrentTime = mockCurrentTime();
          saga = expectSaga(
            downloadIncompatibleSetSaga.downloadIncompatibleSets.bind(
              downloadIncompatibleSetSaga
            ),
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

      test('download incompatible sets success flow', async (): Promise<
        void
      > => {
        const accessToken = 'accessToken';
        const latestSyncTime = moment().toDate();

        const compatibleSets = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'set' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'en',
                lastSyncedAt: latestSyncTime,
              });
            }
          );

        const stillIncompatibleSets = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'set with unknown props' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'en',
                lastSyncedAt: latestSyncTime,
                unknownProps: 'unknownProps',
              } as any);
            }
          );

        // These sets should not be inserted to database
        // as their lastSyncedAt > latestSyncTime
        const passedLatestSyncTimeList = Array(4)
          .fill(null)
          .map(
            (_, index): Set => {
              return new SetBuilder().build({
                setName: 'set should not be inserted' + index,
                learningLanguageCode: 'en',
                translatedToLanguageCode: 'en',
                lastSyncedAt: moment(latestSyncTime)
                  .add(1, 'day')
                  .toDate(),
              });
            }
          );

        const unresolvedSetList = [
          ...compatibleSets,
          ...stillIncompatibleSets,
          ...passedLatestSyncTimeList,
        ];

        const response = {
          data: {
            setList: unresolvedSetList,
          },
        };

        const allSets = new SetResolver().resolveArray(
          response.data.setList,
          true
        );
        const allSetIds = allSets.map((set): string => set.setId);

        const toBeInsertedSets = allSets.filter(
          (set): boolean =>
            set.lastSyncedAt !== null && set.lastSyncedAt <= latestSyncTime
        );

        const chunks = _.chunk(toBeInsertedSets, transactionChunkSize);

        const existingSetIds = toBeInsertedSets
          .filter((_, index): boolean => index % 2 === 0)
          .map((set): string => set.setId);

        saga
          .provide([
            [matchers.call.fn(mockedSessionModel.getAccessToken), accessToken],
            [
              matchers.call.fn(mockedSetModel.getLatestSyncTime),
              latestSyncTime,
            ],
            [
              matchers.call.fn(
                mockedIncompatibleSetModel.getIncompatibleSetIdsForRedownload
              ),
              { setIds: allSetIds },
            ],
            [matchers.call.fn(axios.request), response],
            [matchers.call.fn(mockedSetModel.setIdsExist), existingSetIds],
          ])
          .put(
            createAction(ActionType.SET__DOWNLOADING_INCOMPATIBLE_SETS, null)
          )
          .call([mockedSessionModel, 'getAccessToken'], mockedSharedDatabase)
          .call([mockedSetModel, 'getLatestSyncTime'], mockedUserDatabase)
          .call(
            [mockedIncompatibleSetModel, 'getIncompatibleSetIdsForRedownload'],
            mockedUserDatabase,
            currentComparableCommonVersion,
            downloadLimit,
            true
          )
          .call(
            [axios, 'request'],
            createRequest<DownloadSpecificSetsRequest>(
              'post',
              apiUrl,
              '/download-specific-sets',
              null,
              {
                setIds: allSetIds,
              },
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
            createAction(ActionType.SET__DOWNLOAD_INCOMPATIBLE_SETS_SUCCEEDED, {
              setList: toBeInsertedSets,
            })
          )
          .returns({ success: true, noMore: false })
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
              mockedIncompatibleSetModel.deleteIncompatibleSets
            ).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              chunk.map((set): string => set.setId)
            );
            expect(
              mockedIncompatibleSetModel.upsertIncompatibleSets
            ).toHaveBeenNthCalledWith(
              index + 1,
              mockedTransaction,
              stillIncompatibleSets
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

    describe('Tests start with real database and models', (): void => {
      let databaseFacade: DatabaseFacade;
      let userDb: SQLiteDatabase;
      let modelFactory: ModelFactory;
      let setModel: SetModel;
      let incompatibleSetModel: IncompatibleSetModel;
      let restoreCurrentTime: () => void;

      beforeEach(
        async (): Promise<void> => {
          databaseFacade = new DatabaseFacade(
            new SQLiteDatabaseAdapter(sqlite3)
          );
          await databaseFacade.connectUserDb((await tmp.file()).path);
          await databaseFacade.checkUserDb();
          userDb = databaseFacade.getDb('user');

          modelFactory = new ModelFactory(new DatabaseEventBus());
          setModel = modelFactory.createModel('setModel');
          incompatibleSetModel = modelFactory.createModel(
            'incompatibleSetModel'
          );

          downloadIncompatibleSetSaga = new DownloadIncompatibleSetSaga(
            userDb,
            mockedSharedDatabase,
            mockedSessionModel,
            setModel,
            incompatibleSetModel
          );

          restoreCurrentTime = mockCurrentTime();
        }
      );

      afterEach(
        (): void => {
          restoreCurrentTime();
        }
      );

      describe('Tests start after inserting some sets into database', (): void => {
        let existingSetList: readonly Set[];
        let existingIncompatibleSetIds: readonly string[];
        let restoreCurrentTime: () => void;

        beforeEach(
          async (): Promise<void> => {
            restoreCurrentTime = mockCurrentTime();
            existingSetList = Array(8)
              .fill(null)
              .map(
                (_, index): Set => {
                  return new SetBuilder().build({
                    setName: 'setName' + index,
                    learningLanguageCode: 'en',
                    translatedToLanguageCode: 'en',
                    lastSyncedAt: moment().toDate(),
                  });
                }
              );

            existingIncompatibleSetIds = existingSetList.map(
              (set): string => set.setId
            );

            await userDb.transaction(
              (tx): void => {
                setModel.insertSets(tx, existingSetList, 'remote');
                incompatibleSetModel.upsertIncompatibleSets(
                  tx,
                  existingIncompatibleSetIds,
                  '0000.0000.0001'
                );
              }
            );
          }
        );

        afterEach(
          (): void => {
            restoreCurrentTime();
          }
        );

        describe('Test downloadIncompatibleSets', (): void => {
          let restoreCurrentTime: () => void;
          beforeEach(
            (): void => {
              restoreCurrentTime = mockCurrentTime();
              saga = expectSaga(
                downloadIncompatibleSetSaga.downloadIncompatibleSets.bind(
                  downloadIncompatibleSetSaga
                ),
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

          test('download incompatible sets success flow', async (): Promise<
            void
          > => {
            const accessToken = 'accessToken';
            const latestSyncTime = moment().toDate();

            const stillIncompatibleSets = existingSetList
              .filter((_, index): boolean => index % 2 === 0)
              .map(
                (set, index): Set => {
                  return new SetBuilder().build({
                    ...set,
                    setName: 'incompatibleSets with unknown props' + index,
                    lastSyncedAt: latestSyncTime,
                    unknownProps: 'unknownProps',
                  } as any);
                }
              );

            const compatibleSets = existingSetList
              .filter((_, index): boolean => index % 2 !== 0)
              .map(
                (set, index): Set => {
                  return new SetBuilder().build({
                    ...set,
                    setName: 'compatibleSets' + index,
                    lastSyncedAt: latestSyncTime,
                  });
                }
              );

            const setList = [...stillIncompatibleSets, ...compatibleSets];

            const response = {
              data: {
                setList,
              },
            };

            const toBeInsertedSets = new SetResolver().resolveArray(
              response.data.setList,
              true
            );

            await saga
              .provide([
                [
                  matchers.call.fn(mockedSessionModel.getAccessToken),
                  accessToken,
                ],
                [matchers.call.fn(axios.request), response],
              ])
              .returns({ success: true, noMore: false })
              .run(10000);

            for (const set of toBeInsertedSets) {
              const { set: fetchedSet } = assertExists(
                await setModel.getSetById(userDb, set.setId, true)
              );

              expect(fetchedSet).toEqual(set);
            }

            const {
              setIds,
            } = await incompatibleSetModel.getIncompatibleSetIdsForRedownload(
              userDb,
              '9999.9999.9999',
              downloadLimit,
              true
            );

            expect(setIds).toIncludeSameMembers(
              stillIncompatibleSets.map((set): string => set.setId)
            );
          });
        });
      });
    });
  });
});
