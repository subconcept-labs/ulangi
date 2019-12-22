/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import '../utils/extendSquel';

import { assertExists } from '@ulangi/assert';
import { SQLiteDatabase, SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';

import { SharedDatabaseMigrationRunner } from '../database-migrations/SharedDatabaseMigrationRunner';
import { UserDatabaseMigrationRunner } from '../database-migrations/UserDatabaseMigrationRunner';

export class DatabaseFacade {
  private sharedDb?: SQLiteDatabase;
  private userDb?: SQLiteDatabase;

  private databaseAdapter: SQLiteDatabaseAdapter;

  public constructor(databaseAdapter: SQLiteDatabaseAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  public connectSharedDb(databaseFilePath: string): Promise<void> {
    return new Promise<void>(
      async (resolve, reject): Promise<void> => {
        try {
          this.sharedDb = this.databaseAdapter.createDatabase();
          await this.sharedDb.open(databaseFilePath, {
            // eslint-disable-next-line
            enable_foreign_keys: true,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public connectUserDb(databaseFilePath: string): Promise<void> {
    return new Promise<void>(
      async (resolve, reject): Promise<void> => {
        try {
          this.userDb = this.databaseAdapter.createDatabase();
          await this.userDb.open(databaseFilePath, {
            // eslint-disable-next-line
            enable_foreign_keys: true,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public getDb(databaseType: 'shared' | 'user'): SQLiteDatabase {
    if (databaseType === 'shared' && typeof this.sharedDb !== 'undefined') {
      return this.sharedDb;
    } else if (databaseType === 'user' && typeof this.userDb !== 'undefined') {
      return this.userDb;
    } else {
      throw new Error('No connected databases.');
    }
  }

  public close(dbType: 'shared' | 'user'): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        if (dbType === 'shared' && typeof this.sharedDb !== 'undefined') {
          try {
            await this.sharedDb.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        } else if (dbType === 'user' && typeof this.userDb !== 'undefined') {
          try {
            await this.userDb.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          throw new Error(
            `Cannot close database because the database ${dbType} is not connected.`
          );
        }
      }
    );
  }

  public checkSharedDb(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const sharedDb = assertExists(
            this.sharedDb,
            'sharedDb is not yet opened'
          );

          const migrationRunner = new SharedDatabaseMigrationRunner(sharedDb);
          await migrationRunner.run();

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public checkUserDb(): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const userDb = assertExists(this.userDb, 'userDb is not yet opened');

          const migrationRunner = new UserDatabaseMigrationRunner(userDb);
          await migrationRunner.run();

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
