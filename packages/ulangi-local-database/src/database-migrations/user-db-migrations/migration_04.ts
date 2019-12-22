/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

import { TableName } from '../../enums/TableName';

export function migration_04(tx: Transaction): void {
  createUserExtraDataTableIfNotExists(tx);
  addFirstSyncedAtColumnToUserTable(tx);
  addLastSyncedAtColumnToUserTable(tx);
  createDirtyUserFieldTableIfNotExists(tx);
}

function createUserExtraDataTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.USER_EXTRA_DATA} (
      extraDataLocalId INTEGER PRIMARY KEY NOT NULL,
      userId VARCHAR(60) NOT NULL,
      dataName VARCHAR(100) NOT NULL,
      dataValue TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME,
      lastSyncedAt DATETIME,
      fieldState VARCHAR(60) NOT NULL,
      UNIQUE(userId, dataName),
      FOREIGN KEY(userId) REFERENCES ${TableName.USER}(userId)
    )
  `),
    tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_userExtraData_dataName_dataValue ON ${
      TableName.USER_EXTRA_DATA
    }(dataName, dataValue)
  `);
}

function addFirstSyncedAtColumnToUserTable(tx: Transaction): void {
  tx.executeSql(`
    ALTER TABLE ${TableName.USER} 
      ADD COLUMN firstSyncedAt DATETIME;
  `);
}

function addLastSyncedAtColumnToUserTable(tx: Transaction): void {
  tx.executeSql(`
    ALTER TABLE ${TableName.USER} 
      ADD COLUMN lastSyncedAt DATETIME;
  `);
}

function createDirtyUserFieldTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.DIRTY_USER_FIELD} (
      userId VARCHAR(60) NOT NULL,
      fieldName VARCHAR(60) NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      fieldState VARCHAR(60) NOT NULL,
      PRIMARY KEY(userId, fieldName),
      FOREIGN KEY(userId) REFERENCES ${TableName.USER}(userId)
    ) WITHOUT ROWID;
  `);
}
