/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_01(tx: knex.Transaction): Promise<void> {
  await createSetTableIfNotExists(tx);
  await createSetExtraDataTableIfNotExists(tx);
  await createVocabularyTableIfNotExists(tx);
  await createVocabularyCategoryTableIfNotExists(tx);
  await createVocabularyWritingTableIfNotExists(tx);
  await createDefinitionTableIfNotExists(tx);
  await createLockTableIfNotExists(tx);
}

function createSetTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.SET} (
      userId VARCHAR(60) NOT NULL,
      setId VARCHAR(60) NOT NULL,
      setName VARCHAR(191) NOT NULL,
      setStatus VARCHAR(60) NOT NULL,
      learningLanguageCode VARCHAR(60) NOT NULL,
      translatedToLanguageCode VARCHAR(60) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      updatedStatusAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, setId),
      INDEX (userId, lastSyncedAt)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createSetExtraDataTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.SET_EXTRA_DATA} (
      userId VARCHAR(60) NOT NULL,
      setId VARCHAR(60) NOT NULL,
      dataName VARCHAR(60) NOT NULL,
      dataValue TEXT NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, setId, dataName),
      FOREIGN KEY (userId, setId) REFERENCES ${TableName.SET}(userId, setId),
      INDEX (userId, lastSyncedAt)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createVocabularyTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY} (
      userId VARCHAR(60) NOT NULL,
      vocabularyId VARCHAR(60) NOT NULL,
      setId VARCHAR(60) NOT NULL,
      vocabularyText TEXT NOT NULL,
      vocabularyStatus VARCHAR(60) NOT NULL,
      level INT NOT NULL,
      lastLearnedAt DATETIME,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      updatedStatusAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, vocabularyId),
      FOREIGN KEY (userId, setId) REFERENCES ${TableName.SET}(userId, setId),
      INDEX (userId, lastSyncedAt)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createDefinitionTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.DEFINITION} (
      userId VARCHAR(60) NOT NULL,
      definitionId VARCHAR(60) NOT NULL,
      vocabularyId VARCHAR(60) NOT NULL,
      definitionStatus VARCHAR(60) NOT NULL,
      meaning TEXT NOT NULL,
      wordClasses TEXT NOT NULL,
      source VARCHAR(191) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      updatedStatusAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, definitionId),
      FOREIGN KEY (userId, vocabularyId) REFERENCES ${
        TableName.VOCABULARY
      }(userId, vocabularyId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createVocabularyCategoryTableIfNotExists(
  db: knex.Transaction
): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY_CATEGORY} (
      userId VARCHAR(60) NOT NULL,
      vocabularyId VARCHAR(60) NOT NULL,
      categoryName VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, vocabularyId),
      FOREIGN KEY (userId, vocabularyId) REFERENCES ${
        TableName.VOCABULARY
      }(userId, vocabularyId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createVocabularyWritingTableIfNotExists(
  db: knex.Transaction
): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.VOCABULARY_WRITING} (
      userId VARCHAR(60) NOT NULL,
      vocabularyId VARCHAR(60) NOT NULL,
      level VARCHAR(255) NOT NULL DEFAULT 0,
      lastWrittenAt DATETIME DEFAULT NULL,
      disabled TINYINT(1) NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      firstSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastSyncedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, vocabularyId),
      FOREIGN KEY (userId, vocabularyId) REFERENCES ${
        TableName.VOCABULARY
      }(userId, vocabularyId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createLockTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.LOCK} (
      userId VARCHAR(60) NOT NULL,
      lockName VARCHAR(60) NOT NULL,
      PRIMARY KEY (userId, lockName)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
