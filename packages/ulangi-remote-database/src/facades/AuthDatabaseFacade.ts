/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { AuthDatabaseMigrationRunner } from '../database-migrations/AuthDatabaseMigrationRunner';
import { AuthDbConfig } from '../interfaces/AuthDbConfig';

export class AuthDatabaseFacade {
  private authDb: knex;
  private authDbConfig: AuthDbConfig;

  public constructor(authDbConfig: AuthDbConfig) {
    this.authDbConfig = authDbConfig;

    this.authDb = knex({
      client: 'mysql',
      connection: {
        host: this.authDbConfig.host,
        port: this.authDbConfig.port,
        database: this.authDbConfig.databaseName,
        user: this.authDbConfig.user,
        password: this.authDbConfig.password,
        charset: 'utf8mb4',
      },
      pool: { min: 0, max: this.authDbConfig.connectionLimit },
    });
  }

  public getDb(): knex {
    return this.authDb;
  }

  public checkAuthDatabaseTables(): Promise<void> {
    return new Promise<void>(
      async (resolve, reject): Promise<void> => {
        try {
          const migrationRunner = new AuthDatabaseMigrationRunner(this.authDb);
          await migrationRunner.run();

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async closeAuthDatabase(): Promise<void> {
    await this.authDb.destroy();
  }
}
