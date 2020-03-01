/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

import { TableName } from '../../enums/TableName';

// Add vocabulary writing table
// Delete lastSyncedAt index on vocabularyCategory table
export function migration_03(tx: Transaction): void {
  createVocabularyWritingTableIfNotExists(tx);
  createDirtyVocabularyWritingFieldTableIfNotExists(tx);
  dropVocabularyCategoryLastSyncedAtIndexIfExists(tx);
}

function createVocabularyWritingTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY_WRITING} (
      vocabularyWritingLocalId INTEGER PRIMARY KEY NOT NULL,
      vocabularyId VARCHAR(60) UNIQUE NOT NULL,
      lastWrittenAt DATETIME DEFAULT NULL,
      level INTEGER NOT NULL DEFAULT 0,
      disabled INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME,
      lastSyncedAt DATETIME,
      FOREIGN KEY(vocabularyId) REFERENCES ${TableName.VOCABULARY}(vocabularyId)
    )
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_writing_level ON ${
      TableName.VOCABULARY_WRITING
    } (level)
  `);
}

function createDirtyVocabularyWritingFieldTableIfNotExists(
  tx: Transaction
): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.DIRTY_VOCABULARY_WRITING_FIELD} (
      vocabularyId VARCHAR(60) NOT NULL,
      fieldName VARCHAR(60) NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      fieldState VARCHAR(60) NOT NULL,
      PRIMARY KEY(vocabularyId, fieldName),
      FOREIGN KEY(vocabularyId) REFERENCES ${
        TableName.VOCABULARY_WRITING
      }(vocabularyId)
    ) WITHOUT ROWID;
  `);
}

function dropVocabularyCategoryLastSyncedAtIndexIfExists(
  tx: Transaction
): void {
  tx.executeSql(`
    DROP INDEX IF EXISTS idx_vocabulary_category_lastSyncedAt;
  `);
}
