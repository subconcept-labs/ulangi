/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

export function optional_migration(tx: Transaction): void {
  // Replace lastLearnedAt index to level index in vocabulary table
  dropVocabularyLastLearnedAtIndexIfExists(tx);
  createVocabularyLevelIndexIfNotExists(tx);

  dropDirtySetUpdatedAtIndexIfExists(tx);
  dropDirtyVocabularyUpdatedAtIndexIfExists(tx);
}

function dropVocabularyLastLearnedAtIndexIfExists(tx: Transaction): void {
  tx.executeSql(`
    DROP INDEX IF EXISTS idx_vocabulary_lastLearnedAt;
  `);
}

function createVocabularyLevelIndexIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_level;
  `);
}

function dropDirtySetUpdatedAtIndexIfExists(tx: Transaction): void {
  tx.executeSql(`
    DROP INDEX IF EXISTS idx_dirty_set_updatedAt; 
  `);
}

function dropDirtyVocabularyUpdatedAtIndexIfExists(tx: Transaction): void {
  tx.executeSql(`
    DROP INDEX IF EXISTS idx_dirty_vocabulary_updatedAt; 
  `);
}
