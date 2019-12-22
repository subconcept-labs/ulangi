/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

import { TableName } from '../../enums/TableName';

export function migration_01(tx: Transaction): void {
  createSessionTableIfNotExists(tx);
}

function createSessionTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.SESSION} (
      sessionKey VARCHAR(255) PRIMARY KEY NOT NULL,
      sessionValue TEXT
    )
  `);
}
