/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { AuthDatabaseFacade } from '../facades/AuthDatabaseFacade';
import { ShardDatabaseFacade } from '../facades/ShardDatabaseFacade';
import { AuthDbConfig } from '../interfaces/AuthDbConfig';
import { ShardDbConfig } from '../interfaces/ShardDbConfig';

export class DatabaseFacade {
  private authDatabaseFacade: AuthDatabaseFacade;
  private shardDatabaseFacade: ShardDatabaseFacade;

  public constructor(
    authDbConfig: AuthDbConfig,
    allShardDatabaseConfig: readonly ShardDbConfig[],
    shardDatabaseNamePrefix: string
  ) {
    this.authDatabaseFacade = new AuthDatabaseFacade(authDbConfig);
    this.shardDatabaseFacade = new ShardDatabaseFacade(
      allShardDatabaseConfig,
      shardDatabaseNamePrefix
    );
  }

  public checkAuthDatabaseTables(): Promise<void> {
    return this.authDatabaseFacade.checkAuthDatabaseTables();
  }

  public checkAllShardDatabaseTables(): Promise<void> {
    return this.shardDatabaseFacade.checkAllShardDatabaseTables();
  }

  public getDb(authOrShardId: 'auth' | number): knex {
    if (authOrShardId === 'auth') {
      return this.authDatabaseFacade.getDb();
    } else {
      return this.shardDatabaseFacade.getDb(authOrShardId);
    }
  }

  public getRandomShardId(): number {
    return this.shardDatabaseFacade.getRandomShardId();
  }

  public checkTableExists(
    db: knex | knex.Transaction,
    tableName: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await db.schema.hasTable(tableName);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async closeAllDatabases(): Promise<void> {
    await this.authDatabaseFacade.closeAuthDatabase();
    await this.shardDatabaseFacade.closeAllShardDatabases();
  }
}
