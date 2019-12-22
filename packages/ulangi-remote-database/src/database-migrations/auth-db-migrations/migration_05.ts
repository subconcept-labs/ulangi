/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_05(tx: knex.Transaction): Promise<void> {
  await createApiKeyTableIfNotExists(tx);
}

function createApiKeyTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.API_KEY} (
      apiKey VARCHAR(191) PRIMARY KEY NOT NULL,
      apiScope VARCHAR(60) NOT NULL,
      userId VARCHAR(60) NOT NULL,
      expiredAt DATETIME,
      INDEX (userId),
      FOREIGN KEY (userId) REFERENCES ${TableName.USER}(userId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
