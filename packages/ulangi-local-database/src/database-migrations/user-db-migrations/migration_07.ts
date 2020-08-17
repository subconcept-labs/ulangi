import { Transaction } from '@ulangi/sqlite-adapter';

import { TableName } from '../../enums/TableName';

export function migration_07(tx: Transaction): void {
  createLessonResultTableIfNotExists(tx);
}

function createLessonResultTableIfNotExists(tx: Transaction): void {
  tx.executeSql(`
    CREATE TABLE IF NOT EXISTS ${TableName.LESSON_RESULT} (
      lessonResultLocalId INTEGER PRIMARY KEY NOT NULL,
      lessonResultId VARCHAR(60) UNIQUE NOT NULL,
      setId VARCHAR(60) NOT NULL,
      lessonType VARCHAR(60),
      poorCount INTEGER NOT NULL,
      fairCount INTEGER NOT NULL,
      goodCount INTEGER NOT NULL,
      greatCount INTEGER NOT NULL,
      superbCount INTEGER NOT NULL,
      totalCount INTEGER NOT NULL,
      createdAt DATETIME NOT NULL
    )
  `);
}
