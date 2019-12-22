/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';
import * as _ from 'lodash';

import { ShardDatabaseMigrationRunner } from '../database-migrations/ShardDatabaseMigrationRunner';
import { ShardDbConfig } from '../interfaces/ShardDbConfig';

export class ShardDatabaseFacade {
  private shardedDbs: Readonly<{ [p in number]: knex }>;
  private allShardDatabaseConfig: readonly ShardDbConfig[];
  private shardDatabaseNamePrefix: string;

  public constructor(
    allShardDatabaseConfig: readonly ShardDbConfig[],
    shardDatabaseNamePrefix: string
  ) {
    this.allShardDatabaseConfig = allShardDatabaseConfig;
    this.shardDatabaseNamePrefix = shardDatabaseNamePrefix;

    this.shardedDbs = _.fromPairs(
      this.allShardDatabaseConfig.map(
        (config): [number, knex] => {
          const {
            shardId,
            host,
            port,
            user,
            password,
            connectionLimit,
          } = config;
          return [
            shardId,
            knex({
              client: 'mysql',
              connection: {
                host,
                port,
                database: this.shardDatabaseNamePrefix + shardId,
                user,
                password,
                charset: 'utf8mb4',
              },
              pool: { min: 0, max: connectionLimit },
            }),
          ];
        }
      )
    );
  }

  public getDb(shard: number): knex {
    return this.shardedDbs[shard];
  }

  public getRandomShardId(): number {
    const availableShardIds = this.allShardDatabaseConfig.map(
      (config): number => config.shardId
    );
    return availableShardIds[_.random(0, availableShardIds.length - 1)];
  }

  public async checkAllShardDatabaseTables(): Promise<void> {
    for (const shardConfig of this.allShardDatabaseConfig) {
      const { shardId } = shardConfig;
      await this.checkShardDatabaseTables(shardId);
    }
  }

  public checkShardDatabaseTables(shardId: number): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const shardDb = this.getDb(shardId);
          const migrationRunner = new ShardDatabaseMigrationRunner(shardDb);

          await migrationRunner.run();

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async closeShardDatabase(shardId: number): Promise<void> {
    await this.getDb(shardId).destroy();
  }

  public async closeAllShardDatabases(): Promise<void> {
    for (const shardConfig of this.allShardDatabaseConfig) {
      await this.closeShardDatabase(shardConfig.shardId);
    }
  }
}
