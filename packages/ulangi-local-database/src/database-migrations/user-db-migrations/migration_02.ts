/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

import { TableName } from '../../enums/TableName';

// Add incompatible tracking tables
export function migration_02(tx: Transaction): void {
  createIncompatibleSetTableIfNotExists(tx);
  createIncompatibleVocabularyTableIfNotExists(tx);
}

function createIncompatibleSetTableIfNotExists(tx: Transaction): void {
  // Note: Don't add foreign key to the Set table
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.INCOMPATIBLE_SET} (
      setId VARCHAR(60) NOT NULL,
      lastTriedCommonVersion VARCHAR(255) NOT NULL,
      lastTriedAt INTEGER NOT NULL,
      PRIMARY KEY(setId)
    ) WITHOUT ROWID;
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_incompatible_set_lastTriedCommonVersion ON ${
      TableName.INCOMPATIBLE_SET
    }(lastTriedCommonVersion)
  `);
}

function createIncompatibleVocabularyTableIfNotExists(tx: Transaction): void {
  // Note: Don't add foreign key to the Vocabulary table
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.INCOMPATIBLE_VOCABULARY} (
      vocabularyId VARCHAR(60) NOT NULL,
      lastTriedCommonVersion VARCHAR(255) NOT NULL,
      lastTriedAt INTEGER NOT NULL,
      PRIMARY KEY(vocabularyId)
    ) WITHOUT ROWID;
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_incompatible_vocabulary_lastTriedCommonVersion ON ${
      TableName.INCOMPATIBLE_VOCABULARY
    }(lastTriedCommonVersion)
  `);
}
