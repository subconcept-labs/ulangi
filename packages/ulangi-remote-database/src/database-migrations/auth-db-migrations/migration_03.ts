/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_03(tx: knex.Transaction): Promise<void> {
  await createUserExtraDataTableIfNotExists(tx);
}

function createUserExtraDataTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.USER_EXTRA_DATA} (
      userId VARCHAR(60) NOT NULL,
      dataName VARCHAR(60) NOT NULL,
      dataValue TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, dataName),
      FOREIGN KEY (userId) REFERENCES ${TableName.USER}(userId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
