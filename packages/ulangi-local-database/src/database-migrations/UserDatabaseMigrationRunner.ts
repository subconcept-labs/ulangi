/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import * as Joi from 'joi';

import { migration_01 } from './user-db-migrations/migration_01';
import { migration_02 } from './user-db-migrations/migration_02';
import { migration_03 } from './user-db-migrations/migration_03';
import { migration_04 } from './user-db-migrations/migration_04';
import { migration_05 } from './user-db-migrations/migration_05';
import { migration_06 } from './user-db-migrations/migration_06';
import { optional_migration } from './user-db-migrations/optional_migration';

export class UserDatabaseMigrationRunner {
  private migrations: readonly [number, (tx: Transaction) => void][] = [
    [1, migration_01],
    [2, migration_02],
    [3, migration_03],
    [4, migration_04],
    [5, migration_05],
    [6, migration_06],
  ];

  private userDb: SQLiteDatabase;

  public constructor(userDb: SQLiteDatabase) {
    this.userDb = userDb;
  }

  public async run(): Promise<void> {
    const currentVersion = await this.getDatabaseVersion();
    for (const [version, migrationScript] of this.migrations) {
      if (currentVersion < version) {
        await this.userDb.transaction(
          (tx): void => {
            migrationScript(tx);
            this.updateDatabaseVersion(tx, version);
          }
        );
      }
    }
  }

  public async runOptionalMigration(): Promise<void> {
    await this.userDb.transaction(
      (tx): void => {
        optional_migration(tx);
      }
    );
  }

  private async getDatabaseVersion(): Promise<number> {
    const result = await this.userDb.executeSql('PRAGMA user_version;');
    if (result.rows.length === 0) {
      return 0;
    } else {
      return Joi.attempt(result.rows[0].user_version, Joi.number());
    }
  }

  private updateDatabaseVersion(tx: Transaction, version: number): void {
    tx.executeSql(`PRAGMA user_version = ${version};`);
  }
}
