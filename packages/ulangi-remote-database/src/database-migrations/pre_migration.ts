/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

export async function pre_migration(
  tx: knex.Transaction,
  dbInfoTableName: string
): Promise<void> {
  await createAuthDbInfoTableIfNotExists(tx, dbInfoTableName);
}

function createAuthDbInfoTableIfNotExists(
  db: knex.Transaction,
  dbInfoTableName: string
): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${dbInfoTableName} (
      name VARCHAR(60) PRIMARY KEY NOT NULL,
      value VARCHAR(191) NOT NULL
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
