/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { Config } from '../types/Config';

export class DatabaseFacade {
  protected config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  public tableExists(db: knex, tableName: string): Promise<boolean> {
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

  public createDatabase(db: knex.Transaction, dbName: string): knex.Raw {
    return db.raw(`
      CREATE DATABASE ${dbName}
    `);
  }
}
