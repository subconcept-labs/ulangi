/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';
import * as short from 'short-uuid';

import { LockType } from '../enums/LockType';
import { DatabaseFacade } from '../facades/DatabaseFacade';
import { LockModel } from '../models/LockModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('LockModel', (): void => {
  const env = resolveEnv();

  let userId: string;

  beforeEach(
    (): void => {
      userId = short.generate();
    }
  );

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let shardDb: knex;
    let lockModel: LockModel;

    beforeEach(
      (): void => {
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );
        shardDb = databaseFacade.getDb(
          env.ALL_SHARD_DATABASE_CONFIG[0].shardId
        );
        lockModel = new LockModel();
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    test('acquire lock successfully', async (): Promise<void> => {
      await shardDb.transaction(
        async (tx): Promise<void[]> => {
          return Promise.all([
            lockModel.acquireLock(tx, userId, LockType.INSERT_AND_UPDATE_SET),
          ]);
        }
      );
    });
  });
});
