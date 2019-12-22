/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { UserBuilder } from '@ulangi/ulangi-common/builders';
import { ApiScope } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { resolveEnv } from '../setup/resolveEnv';
import { ApiKeyModel } from './ApiKeyModel';
import { UserModel } from './UserModel';

describe('ApiKeyModel', (): void => {
  const env = resolveEnv();

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let authDb: knex;
    let modelFactory: ModelFactory;
    let userModel: UserModel;
    let apiKeyModel: ApiKeyModel;
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
        apiKeyModel = modelFactory.createModel('apiKeyModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        restoreCurrentTime();
        await databaseFacade.closeAllDatabases();
      }
    );

    describe('Tests start after insert an user', (): void => {
      let user: User;
      let password: string;
      let accessKey: string;

      beforeEach(
        async (): Promise<void> => {
          user = new UserBuilder().build({
            email: short.generate() + '@ulangi.com',
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

      test('insert api key successfully', async (): Promise<void> => {
        const apiKey = short.generate();
        const apiScope = ApiScope.SYNC;

        await authDb.transaction(
          async (tx): Promise<void> => {
            return apiKeyModel.insertApiKey(tx, {
              apiKey,
              apiScope,
              userId: user.userId,
              expiredAt: null,
            });
          }
        );

        const { user: fetchedUser } = assertExists(
          await apiKeyModel.getUserByApiKeyAndScope(
            authDb,
            apiKey,
            apiScope,
            true
          )
        );

        expect(fetchedUser).toEqual({
          ...user,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          firstSyncedAt: expect.any(Date),
          lastSyncedAt: expect.any(Date),
        });
      });

      describe('Tests start after inserting apiKey', (): void => {
        let apiKey: string;
        let apiScope: ApiScope;

        beforeEach(
          async (): Promise<void> => {
            apiKey = short.generate();
            apiScope = ApiScope.SYNC;

            await authDb.transaction(
              async (tx): Promise<void> => {
                return apiKeyModel.insertApiKey(tx, {
                  apiKey,
                  apiScope,
                  userId: user.userId,
                  expiredAt: null,
                });
              }
            );
          }
        );

        test('get valid api key by userId and scope', async (): Promise<
          void
        > => {
          const result = assertExists(
            await apiKeyModel.getValidApiKeyByUserIdAndScope(
              authDb,
              user.userId,
              apiScope
            )
          );

          expect(result.apiKey).toEqual(apiKey);
          expect(result.expiredAt).toEqual(null);
        });

        test('get user by api key and scope', async (): Promise<void> => {
          const { user: fetchedUser } = assertExists(
            await apiKeyModel.getUserByApiKeyAndScope(
              authDb,
              apiKey,
              apiScope,
              true
            )
          );

          expect(fetchedUser).toEqual({
            ...user,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            firstSyncedAt: expect.any(Date),
            lastSyncedAt: expect.any(Date),
          });
        });

        test('is api key belonging to user', async (): Promise<void> => {
          const result = await apiKeyModel.isApiKeyBelongingToUser(
            authDb,
            apiKey,
            user.userId
          );

          expect(result).toBeTrue();
        });

        test('delete api key', async (): Promise<void> => {
          await authDb.transaction(
            (tx): Promise<void> => {
              return apiKeyModel.deleteApiKey(tx, apiKey);
            }
          );

          expect(
            await apiKeyModel.getUserByApiKeyAndScope(
              authDb,
              apiKey,
              apiScope,
              true
            )
          ).toBeNull();
        });
      });

      test('return null if api key is expired', async (): Promise<void> => {
        const apiKey = short.generate();
        const apiScope = ApiScope.SYNC;

        await authDb.transaction(
          async (tx): Promise<void> => {
            return apiKeyModel.insertApiKey(tx, {
              apiKey,
              apiScope,
              userId: user.userId,
              expiredAt: moment()
                .subtract(1, 'hours')
                .toDate(),
            });
          }
        );

        const fetchedApiKey = await apiKeyModel.getValidApiKeyByUserIdAndScope(
          authDb,
          user.userId,
          apiScope
        );

        expect(fetchedApiKey).toBeNull();
      });
    });

    test('insert api key failed because user does not exists', async (): Promise<
      void
    > => {
      const apiKey = short.generate();
      const apiScope = ApiScope.SYNC;

      await expect(
        authDb.transaction(
          async (tx): Promise<void> => {
            return apiKeyModel.insertApiKey(tx, {
              apiKey,
              apiScope,
              userId: short.generate(),
              expiredAt: null,
            });
          }
        )
      ).rejects.toThrow();
    });
  });
});
