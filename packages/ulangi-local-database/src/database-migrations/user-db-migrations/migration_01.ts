/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Transaction } from '@ulangi/sqlite-adapter';

import { FieldState } from '../../enums/FieldState';
import { TableName } from '../../enums/TableName';

export function migration_01(tx: Transaction): void {
  createUserTableIfNotExists(tx);
  createSetTableIfNotExists(tx);
  createSetExtraDataTableIfNotExists(tx);
  createVocabularyTableIfNotExists(tx);
  createVocabularyCategoryTableIfNotExists(tx);
  createDefinitionTableIfNotExists(tx);
  createVocabularyFTS4TableIfNotExists(tx);
  createDefinitionFTS4TableIfNotExists(tx);
  createDirtySetFieldTableIfNotExists(tx);
  createDirtyVocabularyFieldTableIfNotExists(tx);
  createDirtyDefinitionFieldTableIfNotExists(tx);
  addFieldStateColumnToSetExtraDataTable(tx);
  dropDirtySetExtraDataFieldTableIfExists(tx);
}

function createUserTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.USER} (
      userLocalId INTEGER PRIMARY KEY NOT NULL,
      userId VARCHAR(60) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL,
      userStatus VARCHAR(60) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);
}

function createSetTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.SET} (
      setLocalId INTEGER PRIMARY KEY NOT NULL,
      setId VARCHAR(60) UNIQUE NOT NULL,
      setName VARCHAR(255) NOT NULL,
      learningLanguageCode VARCHAR(60) NOT NULL,
      translatedToLanguageCode VARCHAR(60) NOT NULL,
      setStatus VARCHAR(60) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      updatedStatusAt DATETIME NOT NULL,
      firstSyncedAt DATETIME,
      lastSyncedAt DATETIME
    )
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_set_setStatus ON ${TableName.SET}(setStatus)
  `);

  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_set_lastSyncedAt ON ${
      TableName.SET
    }(lastSyncedAt)
  `);
}

function createSetExtraDataTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
      CREATE TABLE IF NOT EXISTS ${TableName.SET_EXTRA_DATA} (
        extraDataLocalId INTEGER PRIMARY KEY NOT NULL,
        setId VARCHAR(60) NOT NULL,
        dataName VARCHAR(100) NOT NULL,
        dataValue TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        firstSyncedAt DATETIME,
        lastSyncedAt DATETIME,
        UNIQUE(setId, dataName),
        FOREIGN KEY(setId) REFERENCES ${TableName.SET}(setId)
      )
    `),
    tx.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_setExtraData_dataName_dataValue ON ${
        TableName.SET_EXTRA_DATA
      }(dataName, dataValue)
    `);
}

function createVocabularyTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY} (
      vocabularyLocalId INTEGER PRIMARY KEY NOT NULL,
      vocabularyId VARCHAR(60) UNIQUE NOT NULL,
      setId VARCHAR(60) NOT NULL,
      vocabularyStatus VARCHAR(60) NOT NULL,
      vocabularyText TEXT NOT NULL,
      level INTEGER NOT NULL,
      lastLearnedAt DATETIME,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      updatedStatusAt DATETIME NOT NULL,
      firstSyncedAt DATETIME,
      lastSyncedAt DATETIME,
      FOREIGN KEY(setId) REFERENCES ${TableName.SET}(setId)
    )
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_updatedStatusAt ON ${
      TableName.VOCABULARY
    } (updatedStatusAt)
  `);
  // Note we changed from indexing on lastLearnedAt to level. Since this migration is not mandatory, some users might still use lastLearnedAt index.
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON ${
      TableName.VOCABULARY
    } (level)
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_lastSyncedAt ON ${
      TableName.VOCABULARY
    } (lastSyncedAt)
  `);
}

function createVocabularyCategoryTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY_CATEGORY} (
      vocabularyCategoryLocalId INTEGER PRIMARY KEY NOT NULL,
      vocabularyId VARCHAR(60) UNIQUE NOT NULL,
      categoryName VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME,
      lastSyncedAt DATETIME,
      fieldState VARCHAR(60) NOT NULL,
      FOREIGN KEY(vocabularyId) REFERENCES ${TableName.VOCABULARY}(vocabularyId)
    )
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_vocabulary_category_categoryName ON ${
      TableName.VOCABULARY_CATEGORY
    } (categoryName)
  `);
}

function createDefinitionTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.DEFINITION} (
      definitionLocalId INTEGER PRIMARY KEY NOT NULL,
      definitionId VARCHAR(60) UNIQUE NOT NULL,
      vocabularyId VARCHAR(60) NOT NULL,
      definitionStatus VARCHAR(60) NOT NULL,
      meaning TEXT NOT NULL,
      wordClasses TEXT NOT NULL,
      source VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      updatedStatusAt DATETIME NOT NULL,
      firstSyncedAt DATETIME,
      lastSyncedAt DATETIME,
      FOREIGN KEY(vocabularyId) REFERENCES ${TableName.VOCABULARY}(vocabularyId)
    )
  `);
  tx.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_definition_vocabularyId ON ${
      TableName.DEFINITION
    }(vocabularyId)
  `);
}

function createVocabularyFTS4TableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE VIRTUAL TABLE IF NOT EXISTS ${TableName.VOCABULARY_FTS4} USING fts4(
      vocabularyText, content='${TableName.VOCABULARY}'
    )
  `);
}

function createDefinitionFTS4TableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE VIRTUAL TABLE IF NOT EXISTS ${TableName.DEFINITION_FTS4} USING fts4(
      meaning, content='${TableName.DEFINITION}'
    )
  `);
}

function createDirtySetFieldTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.DIRTY_SET_FIELD} (
      setId VARCHAR(60) NOT NULL,
      fieldName VARCHAR(60) NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      fieldState VARCHAR(60) NOT NULL,
      PRIMARY KEY(setId, fieldName),
      FOREIGN KEY(setId) REFERENCES ${TableName.SET}(setId)
    ) WITHOUT ROWID;
  `);
}

function createDirtyVocabularyFieldTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.DIRTY_VOCABULARY_FIELD} (
      vocabularyId VARCHAR(60) NOT NULL,
      fieldName VARCHAR(60) NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      fieldState VARCHAR(60) NOT NULL,
      PRIMARY KEY(vocabularyId, fieldName),
      FOREIGN KEY(vocabularyId) REFERENCES ${TableName.VOCABULARY}(vocabularyId)
    ) WITHOUT ROWID;
  `);
}

function createDirtyDefinitionFieldTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.DIRTY_DEFINITION_FIELD} (
      definitionId VARCHAR(60) NOT NULL,
      fieldName VARCHAR(60) NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      fieldState VARCHAR(60) NOT NULL,
      PRIMARY KEY(definitionId, fieldName),
      FOREIGN KEY(definitionId) REFERENCES ${TableName.DEFINITION}(definitionId)
    ) WITHOUT ROWID;
  `);
}

function addFieldStateColumnToSetExtraDataTable(tx: Transaction): void {
  tx.executeSql(`
    ALTER TABLE ${TableName.SET_EXTRA_DATA} 
      ADD COLUMN fieldState VARCHAR(60) NOT NULL DEFAULT ${
        FieldState.TO_BE_SYNCED
      };
  `);
}

function dropDirtySetExtraDataFieldTableIfExists(tx: Transaction): void {
  tx.executeSql(`
    DROP TABLE IF EXISTS ulangi_dirty_set_extra_data_field;
  `);
}
