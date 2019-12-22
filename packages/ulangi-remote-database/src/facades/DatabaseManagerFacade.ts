/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { AuthDbConfig } from '../interfaces/AuthDbConfig';
import { ShardDbConfig } from '../interfaces/ShardDbConfig';

export class DatabaseManagerFacade {
  public async createAllDatabasesIfNotExists(
    authDatabaseConfig: AuthDbConfig,
    allShardDatabaseConfig: readonly ShardDbConfig[],
    shardDatabaseNamePrefix: string
  ): Promise<void> {
    await this.createAuthDatabaseIfNotExists(authDatabaseConfig);
    await this.createAllShardDatabasesIfNotExist(
      allShardDatabaseConfig,
      shardDatabaseNamePrefix
    );
  }

  public createAuthDatabaseIfNotExists(
    authDatabaseConfig: AuthDbConfig
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const db = knex({
            client: 'mysql',
            connection: {
              host: authDatabaseConfig.host,
              port: authDatabaseConfig.port,
              user: authDatabaseConfig.user,
              password: authDatabaseConfig.password,
            },
          });

          await db.raw(
            `CREATE DATABASE IF NOT EXISTS ${authDatabaseConfig.databaseName}`
          );
          await db.destroy();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async createAllShardDatabasesIfNotExist(
    allShardDatabaseConfig: readonly ShardDbConfig[],
    shardDatabaseNamePrefix: string
  ): Promise<void> {
    for (const shardConfig of allShardDatabaseConfig) {
      await this.createShardDatabaseIfNotExist(
        shardConfig,
        shardDatabaseNamePrefix
      );
    }
  }

  public createShardDatabaseIfNotExist(
    shardConfig: ShardDbConfig,
    shardDatabaseNamePrefix: string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          let db = knex({
            client: 'mysql',
            connection: {
              host: shardConfig.host,
              port: shardConfig.port,
              user: shardConfig.user,
              password: shardConfig.password,
            },
          });

          await db.raw(
            `CREATE DATABASE IF NOT EXISTS ${shardDatabaseNamePrefix +
              shardConfig.shardId}`
          );
          await db.destroy();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public databaseExists(
    host: string,
    port: number,
    user: string,
    password: string,
    dbName: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const db = knex({
            client: 'mysql',
            connection: {
              host,
              port,
              user,
              password,
            },
          });

          const result = await db
            .select('SCHEMA_NAME')
            .from('INFORMATION_SCHEMA.SCHEMATA')
            .where({
              SCHEMA_NAME: dbName,
            })
            .limit(1);
          if (result.length === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public dropDatabase(
    host: string,
    port: number,
    user: string,
    password: string,
    dbName: string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const db = knex({
            client: 'mysql',
            connection: {
              host,
              port,
              user,
              password,
            },
          });

          await db.transaction(
            (tx): void => {
              tx.raw(`DROP database ${dbName}`);
            }
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
