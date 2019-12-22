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
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyUserExtraDataModel } from '../models/DirtyUserExtraDataModel';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserModel } from '../models/UserModel';

describe('DirtyUserExtraDataModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let databaseEventBus: DatabaseEventBus;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
    let userModel: UserModel;
    let userExtraDataModel: UserExtraDataModel;
    let dirtyUserExtraDataModel: DirtyUserExtraDataModel;
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

        test('get dirty extra data', async (): Promise<void> => {
          const {
            userExtraData: dirtyUserExtraData,
          } = await dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            user.userId,
            true
          );

          expect(dirtyUserExtraData).toEqual(userExtraData);
        });

        test('mark records as synced', async (): Promise<void> => {
          const {
            markUserExtraDataAsSynced,
          } = await dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            user.userId,
            true
          );

          await userDb.transaction(
            (tx): void => {
              markUserExtraDataAsSynced(tx);
            }
          );

          const {
            userExtraData: dirtyUserExtraData,
          } = await dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            user.userId,
            true
          );

          expect(dirtyUserExtraData).toEqual([]);
        });

        test('transition field state', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              dirtyUserExtraDataModel.transitionFieldState(tx, user.userId, {
                fromState: FieldState.TO_BE_SYNCED,
                toState: FieldState.SYNCED,
              });
            }
          );

          const {
            userExtraData: dirtyUserExtraData,
          } = await dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            user.userId,
            true
          );

          expect(dirtyUserExtraData).toEqual([]);
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

        test('get dirty extra data should only return dirty records', async (): Promise<
          void
        > => {
          const {
            userExtraData: dirtyUserExtraData,
          } = await dirtyUserExtraDataModel.getDirtyExtraDataForSyncing(
            userDb,
            user.userId,
            true
          );

          expect(dirtyUserExtraData).toEqual([]);
        });
      });
    });
  });
});
