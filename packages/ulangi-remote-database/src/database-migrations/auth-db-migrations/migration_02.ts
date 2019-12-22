/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_02(tx: knex.Transaction): Promise<void> {
  await addSyncedAtColumnsToUserTable(tx);
}

function addSyncedAtColumnsToUserTable(db: knex.Transaction): knex.Raw {
  return db.raw(`
    ALTER TABLE ${TableName.USER} 
      ADD firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
  `);
}
