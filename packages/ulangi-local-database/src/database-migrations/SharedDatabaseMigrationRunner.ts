/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabase, Transaction } from '@ulangi/sqlite-adapter';
import * as Joi from 'joi';

import { migration_01 } from './shared-db-migrations/migration_01';

export class SharedDatabaseMigrationRunner {
  private migrations: readonly [number, (tx: Transaction) => void][] = [
    [1, migration_01],
  ];

  private sharedDb: SQLiteDatabase;

  public constructor(sharedDb: SQLiteDatabase) {
    this.sharedDb = sharedDb;
  }

  public async run(): Promise<void> {
    const currentVersion = await this.getDatabaseVersion();
    for (const [version, migrationScript] of this.migrations) {
      if (currentVersion < version) {
        await this.sharedDb.transaction(
          (tx): void => {
            migrationScript(tx);
            this.updateDatabaseVersion(tx, version);
          }
        );
      }
    }
  }

  private async getDatabaseVersion(): Promise<number> {
    const result = await this.sharedDb.executeSql('PRAGMA user_version;');
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
