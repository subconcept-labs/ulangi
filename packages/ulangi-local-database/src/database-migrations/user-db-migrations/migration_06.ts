/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

import { TableName } from '../../enums/TableName';

export function migration_06(tx: Transaction): void {
  createVocabularyLocalDataTableIfNotExists(tx);
}

function createVocabularyLocalDataTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY_LOCAL_DATA} (
      vocabularyLocalDataId INTEGER PRIMARY KEY NOT NULL,
      vocabularyId VARCHAR(60) UNIQUE NOT NULL,
      vocabularyTerm TEXT DEFAULT NULL,
      FOREIGN KEY(vocabularyId) REFERENCES ${TableName.VOCABULARY}(vocabularyId)
    )
  `),
    tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_local_data_vocabularyTerm ON ${
      TableName.VOCABULARY_LOCAL_DATA
    }(vocabularyTerm)
  `);
}
