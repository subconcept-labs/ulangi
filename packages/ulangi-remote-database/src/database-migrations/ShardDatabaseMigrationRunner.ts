/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';
import * as knex from 'knex';
import * as _ from 'lodash';

import { TableName } from '../enums/TableName';
import { pre_migration } from './pre_migration';
import { migration_01 } from './shard-db-migrations/migration_01';
import { migration_02 } from './shard-db-migrations/migration_02';

export class ShardDatabaseMigrationRunner {
  private migrations: readonly [number, (tx: knex.Transaction) => void][] = [
    [1, migration_01],
    [2, migration_02],
  ];

  private shardDb: knex;

  public constructor(shardDb: knex) {
    this.shardDb = shardDb;
  }

  public async run(): Promise<void> {
    await this.preMigration();

    const currentVersion = await this.getDatabaseVersion();

    for (const [version, migrationScript] of this.migrations) {
      if (currentVersion < version) {
        await this.shardDb.transaction(
          async (tx): Promise<void> => {
            await migrationScript(tx);
            await this.updateDatabaseVersion(tx, version);
          }
        );
      }
    }
  }

  private async preMigration(): Promise<void> {
    await this.shardDb.transaction(
      async (tx): Promise<void> => {
        await pre_migration(tx, TableName.SHARD_DB_INFO);
      }
    );
  }

  private getDatabaseVersion(): Promise<number> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const results = await this.shardDb
            .select()
            .from(TableName.SHARD_DB_INFO)
            .where('name', 'databaseVersion');

          if (results.length === 0) {
            resolve(0);
          } else {
            resolve(
              Joi.attempt(_.get(_.first(results), 'value'), Joi.number())
            );
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private updateDatabaseVersion(
    db: knex.Transaction,
    databaseVersion: number
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const { sql: insertSql, bindings } = db
            .insert({
              name: 'databaseVersion',
              value: databaseVersion.toString(),
            })
            .into(TableName.SHARD_DB_INFO)
            .toSQL();
          const replaceSql = insertSql.replace('insert', 'replace');

          await db.raw(replaceSql, bindings);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
