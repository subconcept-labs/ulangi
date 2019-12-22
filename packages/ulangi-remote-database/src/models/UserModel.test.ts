/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { UserBuilder } from '@ulangi/ulangi-common/builders';
import { UserExtraDataName, UserStatus } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { resolveEnv } from '../setup/resolveEnv';
import { UserModel } from './UserModel';

describe('UserModel', (): void => {
  const env = resolveEnv();

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let authDb: knex;
    let modelFactory: ModelFactory;
    let userModel: UserModel;
    let restoreCurrentTime: () => void;

    beforeEach(
      async (): Promise<void> => {
        restoreCurrentTime = mockCurrentTime();
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );
        await databaseFacade.checkAuthDatabaseTables();
        authDb = databaseFacade.getDb('auth');
        modelFactory = new ModelFactory();
        userModel = modelFactory.createModel('userModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        restoreCurrentTime();
        await databaseFacade.closeAllDatabases();
      }
    );

    test('insert user successfully', async (): Promise<void> => {
      const user = new UserBuilder().build({
        email: short.generate() + '@ulangi.com',
      });
      const password = 'password';
      const accessKey = short.generate();

      await authDb.transaction(
        async (tx): Promise<void[]> => {
          return Promise.all([
            userModel.insertUser(
              tx,
              user,
              env.ALL_SHARD_DATABASE_CONFIG[0].shardId,
              password,
              accessKey
            ),
          ]);
        }
      );
    });

    describe('Tests start after inserting user with extra data into database', (): void => {
      let user: User;
      let password: string;
      let accessKey: string;

      beforeEach(
        async (): Promise<void> => {
          user = new UserBuilder().build({
            email: short.generate() + '@ulangi.com',
            extraData: [
              {
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: true,
                  spacedRepetitionLevelThreshold: 5,
                  writingLevelThreshold: 8,
                },
              },
            ],
          });

          password = 'password';
          accessKey = short.generate();

          await authDb.transaction(
            async (tx): Promise<void[]> => {
              return Promise.all([
                userModel.insertUser(
                  tx,
                  user,
                  env.ALL_SHARD_DATABASE_CONFIG[0].shardId,
                  password,
                  accessKey
                ),
              ]);
            }
          );
        }
      );

      test('get user by id and access key', async (): Promise<void> => {
        const {
          user: fetchedUser,
          shardId: fetchedShardId,
          password: fetchedPassword,
          accessKey: fetchedAccessKey,
        } = assertExists(
          await userModel.getUserByIdAndAccessKey(
            authDb,
            user.userId,
            accessKey,
            true
          )
        );

        expect(fetchedUser).toEqual({
          ...user,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          firstSyncedAt: expect.any(Date),
          lastSyncedAt: expect.any(Date),
          extraData: user.extraData.map(
            (data): UserExtraDataItem => {
              return {
                ...data,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          ),
        });

        expect(fetchedShardId).toEqual(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );
        expect(fetchedPassword).toEqual(password);
        expect(fetchedAccessKey).toEqual(accessKey);
      });

      test('get user by id', async (): Promise<void> => {
        const {
          user: fetchedUser,
          shardId: fetchedShardId,
          password: fetchedPassword,
          accessKey: fetchedAccessKey,
        } = assertExists(
          await userModel.getUserById(authDb, user.userId, true)
        );

        expect(fetchedUser).toEqual({
          ...user,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          firstSyncedAt: expect.any(Date),
          lastSyncedAt: expect.any(Date),
          extraData: user.extraData.map(
            (data): UserExtraDataItem => {
              return {
                ...data,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          ),
        });

        expect(fetchedShardId).toEqual(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );
        expect(fetchedPassword).toEqual(password);
        expect(fetchedAccessKey).toEqual(accessKey);
      });

      test('get user by email', async (): Promise<void> => {
        const {
          user: fetchedUser,
          shardId: fetchedShardId,
          password: fetchedPassword,
          accessKey: fetchedAccessKey,
        } = assertExists(
          await userModel.getUserByEmail(authDb, user.email, true)
        );

        expect(fetchedUser).toEqual({
          ...user,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          firstSyncedAt: expect.any(Date),
          lastSyncedAt: expect.any(Date),
          extraData: user.extraData.map(
            (data): UserExtraDataItem => {
              return {
                ...data,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          ),
        });

        expect(fetchedShardId).toEqual(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );
        expect(fetchedPassword).toEqual(password);
        expect(fetchedAccessKey).toEqual(accessKey);
      });

      test('get user id by email', async (): Promise<void> => {
        const userId = await userModel.getUserIdByEmail(authDb, user.email);

        expect(userId).toEqual(user.userId);
      });

      test('email exists', async (): Promise<void> => {
        const exists = await userModel.emailExists(authDb, user.email);

        expect(exists).toEqual(true);
      });

      test('get latest sync time', async (): Promise<void> => {
        const latestSyncTime = await userModel.getLatestSyncTime(
          authDb,
          user.userId
        );

        expect(latestSyncTime).toEqual(expect.any(Date));
      });

      test('update user', async (): Promise<void> => {
        const newPassword = 'newPassword';
        const newAccessKey = 'newAccessKey';
        const editedUser: DeepPartial<User> = {
          ...user,
          email: short.generate() + '@ulangi.com',
          userStatus: UserStatus.DISABLED,
          extraData: [
            {
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: false,
                spacedRepetitionLevelThreshold: 4,
                writingLevelThreshold: 5,
              },
            },
          ],
        };

        await authDb.transaction(
          async (tx): Promise<void> => {
            return userModel.updateUser(
              tx,
              editedUser,
              newPassword,
              newAccessKey
            );
          }
        );

        const { user: fetchedUser } = assertExists(
          await userModel.getUserById(authDb, user.userId, true)
        );

        expect(fetchedUser).toEqual({
          ...editedUser,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          firstSyncedAt: expect.any(Date),
          lastSyncedAt: expect.any(Date),
          extraData: user.extraData.map(
            (extraDataItem): UserExtraDataItem => {
              return {
                ...extraDataItem,
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: false,
                  spacedRepetitionLevelThreshold: 4,
                  writingLevelThreshold: 5,
                },
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          ),
        });
      });
    });
  });
});
