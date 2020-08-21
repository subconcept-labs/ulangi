/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_02(tx: knex.Transaction): Promise<void> {
  await createLessonResultTableIfNotExists(tx);
}

function createLessonResultTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.LESSON_RESULT} (
      userId VARCHAR(60) NOT NULL,
      lessonResultId VARCHAR(60) NOT NULL,
      lessonType VARCHAR(60) NOT NULL,
      setId VARCHAR(60) NOT NULL,
      poorCount SMALLINT UNSIGNED NOT NULL,
      fairCount SMALLINT UNSIGNED NOT NULL,
      goodCount SMALLINT UNSIGNED NOT NULL,
      greatCount SMALLINT UNSIGNED NOT NULL,
      superbCount SMALLINT UNSIGNED NOT NULL,
      totalCount SMALLINT UNSIGNED NOT NULL,
      createdAt DATETIME NOT NULL,
      PRIMARY KEY (userId, lessonResultId),
      INDEX (userId, createdAt)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
