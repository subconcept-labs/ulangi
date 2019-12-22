/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { UserBuilder } from '@ulangi/ulangi-common/builders';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { FieldState } from '../enums/FieldState';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyUserModel } from '../models/DirtyUserModel';
import { UserModel } from '../models/UserModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('DirtyUserModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let modelFactory: ModelFactory;
    let userDb: SQLiteDatabase;
    let userModel: UserModel;
    let dirtyUserModel: DirtyUserModel;
    let mockedDatabaseEventBus: DatabaseEventBus;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        mockedDatabaseEventBus = new DatabaseEventBusMock();

        databaseFacade = new DatabaseFacade(new SQLiteDatabaseAdapter(sqlite3));
        await databaseFacade.connectUserDb((await tmp.file()).path);
        await databaseFacade.checkUserDb();
        userDb = databaseFacade.getDb('user');

        modelFactory = new ModelFactory(mockedDatabaseEventBus);

        userModel = modelFactory.createModel('userModel');
        dirtyUserModel = modelFactory.createModel('dirtyUserModel');

        restoreCurrentTime = mockCurrentTime();
      }
    );

    afterEach(
      (): void => {
        restoreCurrentTime();
      }
    );

    describe('Tests start after inserting user and extra data from remote', (): void => {
      let user: User;

      beforeEach(
        async (): Promise<void> => {
          user = new UserBuilder().build({
            email: 'test@ulangi.com',
            extraData: [
              {
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: true,
                  spacedRepetitionLevelThreshold: 4,
                  writingLevelThreshold: 6,
                },
              },
            ],
          });

          await userDb.transaction(
            (tx): void => {
              userModel.insertUser(tx, user, 'remote');
            }
          );
        }
      );

      describe('Tests start after updating user and extra data from local', (): void => {
        let editedUser: DeepPartial<User>;

        beforeEach(
          async (): Promise<void> => {
            editedUser = {
              userId: user.userId,
              updatedAt: moment().toDate(),
            };

            await userDb.transaction(
              (tx): void => {
                userModel.updateUser(tx, editedUser, 'local');
              }
            );
          }
        );

        test('get dirty user for syncing', async (): Promise<void> => {
          const { user: dirtyUser } = assertExists(
            await dirtyUserModel.getDirtyUserForSyncing(
              userDb,
              user.userId,
              true
            )
          );

          expect(dirtyUser).toEqual({
            ...editedUser,
            extraData: [],
          });
        });

        test('mark user as synced', async (): Promise<void> => {
          const { markUserAsSynced } = assertExists(
            await dirtyUserModel.getDirtyUserForSyncing(
              userDb,
              user.userId,
              true
            )
          );

          await userDb.transaction(
            (tx): void => {
              markUserAsSynced(tx);
            }
          );

          const { user: dirtyUser } = assertExists(
            await dirtyUserModel.getDirtyUserForSyncing(
              userDb,
              user.userId,
              true
            )
          );

          expect(dirtyUser).toEqual(null);
        });

        test('delete dirty fields', async (): Promise<void> => {
          await userDb.transaction(
            (tx): void => {
              dirtyUserModel.deleteDirtyFields(
                tx,
                [{ userId: user.userId, fieldName: 'updatedAt' }],
                {
                  withState: FieldState.TO_BE_SYNCED,
                }
              );
            }
          );

          const { user: dirtyUser } = assertExists(
            await dirtyUserModel.getDirtyUserForSyncing(
              userDb,
              user.userId,
              true
            )
          );

          expect(dirtyUser).toEqual(null);
        });
      });
    });
  });
});
