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
import {
  UserExtraDataName,
  UserMembership,
  UserStatus,
} from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as moment from 'moment';
import * as sqlite3 from 'sqlite3';
import * as tmp from 'tmp-promise';

import { DatabaseEvent } from '../enums/DatabaseEvent';
import { DatabaseEventBus } from '../event-buses/DatabaseEventBus';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { DirtyUserModel } from '../models/DirtyUserModel';
import { UserModel } from '../models/UserModel';

const { DatabaseEventBus: DatabaseEventBusMock } = jest.genMockFromModule(
  '../event-buses/DatabaseEventBus'
);

describe('UserModel', (): void => {
  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let userDb: SQLiteDatabase;
    let modelFactory: ModelFactory;
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

    test('should not allow insert user from local', async (): Promise<void> => {
      const user = new UserBuilder().build({
        userId: 'userId',
        email: 'email@ulangi.com',
        userStatus: UserStatus.ACTIVE,
        membership: UserMembership.SUBSCRIBED_PREMIUM,
        membershipExpiredAt: moment().toDate(),
      });

      await expect(
        userDb.transaction(
          (tx): void => {
            userModel.insertUser(tx, user, 'local');
          }
        )
      ).rejects.toThrow();
    });

    test('insert user from remote successfully', async (): Promise<void> => {
      const user = new UserBuilder().build({
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
    });

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

      test('get user by id', async (): Promise<void> => {
        const { user: fetchedUser } = assertExists(
          await userModel.getUserById(userDb, user.userId, true)
        );
        expect(fetchedUser).toEqual(user);
      });

      test('user exists', async (): Promise<void> => {
        const existing = await userModel.userExists(userDb, user.userId);
        expect(existing).toEqual(true);
      });

      test('update user from remote can only overwrite clean fields', async (): Promise<
        void
      > => {
        const editedUser: DeepPartial<User> = {
          userId: user.userId,
          email: 'edited_email@ulangi.com',
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: false,
                spacedRepetitionLevelThreshold: 10,
                writingLevelThreshold: 10,
              },
              firstSyncedAt: moment().toDate(),
              lastSyncedAt: moment().toDate(),
            },
          ],
        };

        await userDb.transaction(
          (tx): void => {
            userModel.updateUser(tx, editedUser, 'remote');
          }
        );

        const { user: fetchedUser } = assertExists(
          await userModel.getUserById(userDb, user.userId, true)
        );

        expect(fetchedUser).toEqual({
          ...user,
          email: 'edited_email@ulangi.com',
          extraData: user.extraData.map(
            (extraDataItem): UserExtraDataItem => {
              return {
                ...extraDataItem,
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: false,
                  spacedRepetitionLevelThreshold: 10,
                  writingLevelThreshold: 10,
                },
                firstSyncedAt: moment().toDate(),
                lastSyncedAt: moment().toDate(),
              };
            }
          ),
        });
      });

      test('update user from local can only overwrite updatedAt field', async (): Promise<
        void
      > => {
        const editedUser = {
          userId: user.userId,
          email: 'edited_email@ulangi.com',
          userStatus: UserStatus.DISABLED,
          updatedAt: moment().toDate(),
        };

        await userDb.transaction(
          (tx): void => {
            userModel.updateUser(tx, editedUser, 'local');
          }
        );

        const { user: fetchedUser } = assertExists(
          await userModel.getUserById(userDb, user.userId, true)
        );

        expect(fetchedUser).toEqual({
          ...user,
          updatedAt: moment().toDate(),
        });

        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledTimes(1);
        expect(mockedDatabaseEventBus.publish).toHaveBeenCalledWith(
          DatabaseEvent.USER_UPDATED_FROM_LOCAL
        );
      });

      test('update user from local should mark record as dirty', async (): Promise<
        void
      > => {
        const editedUser: DeepPartial<User> = {
          userId: user.userId,
          email: 'edited_email@ulangi.com',
          userStatus: UserStatus.DISABLED,
          updatedAt: moment().toDate(),
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: false,
                spacedRepetitionLevelThreshold: 8,
                writingLevelThreshold: 8,
              },
            },
          ],
        };

        await userDb.transaction(
          (tx): void => {
            userModel.updateUser(tx, editedUser, 'local');
          }
        );

        const { user: dirtyUser } = await dirtyUserModel.getDirtyUserForSyncing(
          userDb,
          user.userId,
          true
        );

        expect(dirtyUser).toEqual({
          userId: user.userId,
          updatedAt: moment().toDate(),
          extraData: [
            {
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: false,
                spacedRepetitionLevelThreshold: 8,
                writingLevelThreshold: 8,
              },
              firstSyncedAt: null,
              lastSyncedAt: null,
            },
          ],
        });
      });

      test('update user from local can override existing fields', async (): Promise<
        void
      > => {
        const editedUser = {
          userId: user.userId,
          updatedAt: moment().toDate(),
        };
        await userDb.transaction(
          (tx): void => {
            userModel.updateUser(tx, editedUser, 'local');
          }
        );

        const { user: fetchedUser } = assertExists(
          await userModel.getUserById(userDb, user.userId, true)
        );
        expect(fetchedUser).toEqual({
          ...user,
          updatedAt: moment().toDate(),
        });
      });
    });
  });
});
