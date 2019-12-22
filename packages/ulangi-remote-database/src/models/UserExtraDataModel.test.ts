/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  UserBuilder,
  UserExtraDataItemBuilder,
} from '@ulangi/ulangi-common/builders';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as knex from 'knex';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { UserExtraDataModel } from '../models/UserExtraDataModel';
import { UserModel } from '../models/UserModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('UserExtraDataModel', (): void => {
  const env = resolveEnv();

  let userId: string;
  let restoreCurrentTime: () => void;

  beforeEach(
    async (): Promise<void> => {
      userId = short.generate();
      restoreCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let authDb: knex;
    let modelFactory: ModelFactory;
    let userExtraDataModel: UserExtraDataModel;
    let userModel: UserModel;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );
        authDb = databaseFacade.getDb('auth');

        modelFactory = new ModelFactory();
        userExtraDataModel = modelFactory.createModel('userExtraDataModel');
        userModel = modelFactory.createModel('userModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    test('upsert extra data failed due to foreign contraints', async (): Promise<
      void
    > => {
      const userExtraData = [
        new UserExtraDataItemBuilder().build({
          dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
          dataValue: {
            autoArchiveEnabled: true,
            spacedRepetitionLevelThreshold: 10,
            writingLevelThreshold: 10,
          },
        }),
      ];

      await authDb.transaction(
        async (tx): Promise<void> => {
          return userExtraDataModel.upsertMultipleExtraData(
            tx,
            userId,
            userExtraData
          );
        }
      );

      const {
        userExtraData: fetchedUserExtraData,
      } = await userExtraDataModel.getExtraDataByUserId(authDb, userId, true);

      expect(fetchedUserExtraData).toEqual([]);
    });

    describe('Tests start after inserting user', (): void => {
      let user: User;
      let accessKey: string;

      beforeEach(
        async (): Promise<void> => {
          user = new UserBuilder().build({
            userId,
            email: short.uuid() + '@ulangi.com',
          });

          accessKey = short.generate();
          user = new UserBuilder().build({
            userId: user.userId,
            email: user.email,
            userStatus: user.userStatus,
            membership: user.membership,
            membershipExpiredAt: user.membershipExpiredAt,
          });

          await authDb.transaction(
            async (tx): Promise<void> => {
              return userModel.insertUser(
                tx,
                user,
                env.ALL_SHARD_DATABASE_CONFIG[0].shardId,
                'password',
                accessKey
              );
            }
          );
        }
      );

      test('upsert extra data successfully', async (): Promise<void> => {
        const userExtraData = [
          new UserExtraDataItemBuilder().build({
            dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
            dataValue: {
              autoArchiveEnabled: true,
              spacedRepetitionLevelThreshold: 10,
              writingLevelThreshold: 10,
            },
          }),
        ];

        await authDb.transaction(
          async (tx): Promise<void> => {
            return userExtraDataModel.upsertMultipleExtraData(
              tx,
              userId,
              userExtraData
            );
          }
        );

        const {
          userExtraData: fetchedUserExtraData,
        } = await userExtraDataModel.getExtraDataByUserId(authDb, userId, true);

        expect(fetchedUserExtraData).toEqual(
          userExtraData.map(
            (data): UserExtraDataItem => {
              return {
                ...data,
                firstSyncedAt: expect.any(Date),
                lastSyncedAt: expect.any(Date),
              };
            }
          )
        );
      });

      describe('Tests start after inserting some user extra data', (): void => {
        let userExtraData: readonly UserExtraDataItem[];

        beforeEach(
          async (): Promise<void> => {
            userExtraData = [
              new UserExtraDataItemBuilder().build({
                dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
                dataValue: {
                  autoArchiveEnabled: true,
                  spacedRepetitionLevelThreshold: 10,
                  writingLevelThreshold: 10,
                },
              }),
            ];

            await authDb.transaction(
              async (tx): Promise<void> => {
                return userExtraDataModel.upsertMultipleExtraData(
                  tx,
                  userId,
                  userExtraData
                );
              }
            );
          }
        );

        test('get user extra data by user id', async (): Promise<void> => {
          const {
            userExtraData: fetchedUserExtraData,
          } = await userExtraDataModel.getExtraDataByUserId(
            authDb,
            userId,
            true
          );

          expect(fetchedUserExtraData).toEqual(
            userExtraData.map(
              (data): UserExtraDataItem => {
                return {
                  ...data,
                  firstSyncedAt: expect.any(Date),
                  lastSyncedAt: expect.any(Date),
                };
              }
            )
          );
        });

        test('upsert existing extra data', async (): Promise<void> => {
          const editedUserExtraData = [
            new UserExtraDataItemBuilder().build({
              dataName: UserExtraDataName.GLOBAL_AUTO_ARCHIVE,
              dataValue: {
                autoArchiveEnabled: true,
                spacedRepetitionLevelThreshold: 0,
                writingLevelThreshold: 0,
              },
            }),
          ];

          await authDb.transaction(
            async (tx): Promise<void> => {
              return userExtraDataModel.upsertMultipleExtraData(
                tx,
                userId,
                editedUserExtraData
              );
            }
          );

          const {
            userExtraData: fetchedUserExtraData,
          } = await userExtraDataModel.getExtraDataByUserId(
            authDb,
            userId,
            true
          );

          expect(fetchedUserExtraData).toEqual(
            editedUserExtraData.map(
              (data): UserExtraDataItem => {
                return {
                  ...data,
                  firstSyncedAt: expect.any(Date),
                  lastSyncedAt: expect.any(Date),
                };
              }
            )
          );
        });
      });
    });
  });
});
