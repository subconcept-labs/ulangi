/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  UserBuilder,
  UserExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyUserExtraDataModel } from '../models/DirtyUserExtraDataModel';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserModel } from '../models/UserModel';

describe('UserExtraDataModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let databaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let userModel: UserModel;
    let userExtraDataModel: UserExtraDataModel;
    let dirtyUserExtraDataModel: DirtyUserExtraDataModel;
    let modelFactory: ModelFactory;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        databaseEventBus = new DatabaseEventBus();
        await databaseFacade.connectUserDb((await tmp.file()).path);
        await databaseFacade.checkUserDb();
        userDb = databaseFacade.getDb('user');

        modelFactory = new ModelFactory(databaseEventBus);

        userExtraDataModel = modelFactory.createModel('userExtraDataModel');
        userModel = modelFactory.createModel('userModel');
        dirtyUserExtraDataModel = modelFactory.createModel(
          'dirtyUserExtraDataModel'
        );

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    test('upsert extra data failed because of foreign contraints', async (): Promise<
      void
    > => {
      await expect(
        userDb.transaction(
          (tx): void => {
            userExtraDataModel.upsertExtraData(
              tx,
              {
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: true,
                  spacedRepetitionLevelThreshold: 4,
                  writingLevelThreshold: 6,
                },
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                firstSyncedAt: null,
                lastSyncedAt: null,
              },
              'userId',
              'remote'
            );
          }
        )
      ).rejects.toThrow();
    });

    describe('Tests start after inserting user', (): void => {
      let user: User;

      beforeEach(
        async (): Promise<void> => {
          user = new UserBuilder().build({
            email: 'test@ulangi.com',
          });

          await userDb.transaction(
            (tx): void => {
              userModel.insertUser(tx, user, 'remote');
            }
          );
        }
      );

      test('upsert extra data from local successfully', async (): Promise<
        void
      > => {
        const extraData = [
          new UserExtraDataItemBuilder().build({
            dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
            dataValue: {
              autoArchiveEnabled: true,
              spacedRepetitionLevelThreshold: 4,
              writingLevelThreshold: 6,
            },
          }),
        ];

        await userDb.transaction(
          (tx): void => {
            userExtraDataModel.upsertMultipleExtraData(
              tx,
              extraData,
              user.userId,
              'local'
            );
          }
        );

        const {
          userExtraData: fetchedUserExtraData,
        } = await userExtraDataModel.getExtraDataByUserId(
          userDb,
          user.userId,
          true
        );

        expect(fetchedUserExtraData).toEqual(extraData);
      });

      test('upsert extra data from remote successfully', async (): Promise<
        void
      > => {
        const extraData = [
          new UserExtraDataItemBuilder().build({
            dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
            dataValue: {
              autoArchiveEnabled: true,
              spacedRepetitionLevelThreshold: 4,
              writingLevelThreshold: 6,
            },
          }),
        ];

        await userDb.transaction(
          (tx): void => {
            userExtraDataModel.upsertMultipleExtraData(
              tx,
              extraData,
              user.userId,
              'remote'
            );
          }
        );

        const {
          userExtraData: fetchedUserExtraData,
        } = await userExtraDataModel.getExtraDataByUserId(
          userDb,
          user.userId,
          true
        );

        expect(fetchedUserExtraData).toEqual(extraData);
      });

      describe('Tests start after upserting extra data from local', (): void => {
        let userExtraData: readonly UserExtraDataItem[];

        beforeEach(
          async (): Promise<void> => {
            userExtraData = [
              new UserExtraDataItemBuilder().build({
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: true,
                  spacedRepetitionLevelThreshold: 4,
                  writingLevelThreshold: 6,
                },
              }),
            ];

            await userDb.transaction(
              (tx): void => {
                userExtraDataModel.upsertMultipleExtraData(
                  tx,
                  userExtraData,
                  user.userId,
                  'local'
                );
              }
            );
          }
        );

        test('get extra data by userId', async (): Promise<void> => {
          const {
            userExtraData: fetchedUserExtraData,
          } = await userExtraDataModel.getExtraDataByUserId(
            userDb,
            user.userId,
            true
          );

          expect(fetchedUserExtraData).toEqual(userExtraData);
        });

        test('upsert extra data from local should override existing data', async (): Promise<
          void
        > => {
          const editedExtraData = [
            new UserExtraDataItemBuilder().build({
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 10,
              },
            }),
          ];

          await userDb.transaction(
            (tx): void => {
              userExtraDataModel.upsertMultipleExtraData(
                tx,
                editedExtraData,
                user.userId,
                'local'
              );
            }
          );

          const {
            userExtraData: fetchedUserExtraData,
          } = await userExtraDataModel.getExtraDataByUserId(
            userDb,
            user.userId,
            true
          );

          expect(fetchedUserExtraData).toEqual(editedExtraData);
        });

        test('upsert extra data from remote should not overwrite dirty data', async (): Promise<
          void
        > => {
          const editedExtraData = [
            new UserExtraDataItemBuilder().build({
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 10,
              },
            }),
          ];

          await userDb.transaction(
            (tx): void => {
              userExtraDataModel.upsertMultipleExtraData(
                tx,
                editedExtraData,
                user.userId,
                'remote'
              );
            }
          );

          const {
            userExtraData: fetchedUserExtraData,
          } = await userExtraDataModel.getExtraDataByUserId(
            userDb,
            user.userId,
            true
          );

          expect(fetchedUserExtraData).toEqual(userExtraData);
        });
      });

      describe('Tests start after upserting extra data from remote', (): void => {
        let userExtraData: readonly UserExtraDataItem[];

        beforeEach(
          async (): Promise<void> => {
            userExtraData = [
              new UserExtraDataItemBuilder().build({
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: true,
                  spacedRepetitionLevelThreshold: 4,
                  writingLevelThreshold: 6,
                },
              }),
            ];

            await userDb.transaction(
              (tx): void => {
                userExtraDataModel.upsertMultipleExtraData(
                  tx,
                  userExtraData,
                  user.userId,
                  'remote'
                );
              }
            );
          }
        );

        test('upsert extra data from remote should not mark records as dirty', async (): Promise<
          void
        > => {
          const {
            userExtraData: fetchedUserExtraData,
          } = await dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            user.userId,
            true
          );

          expect(fetchedUserExtraData).toEqual([]);
        });
      });
    });
  });
});
