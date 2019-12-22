/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_01(tx: knex.Transaction): Promise<void> {
  await createUserTableIfNotExists(tx);
  await createResetPasswordRequestTableIfNotExists(tx);
}

function createUserTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.USER} (
      userId VARCHAR(60) PRIMARY KEY NOT NULL,
      shardId INT NOT NULL,
      email VARCHAR(191) NOT NULL,
      password VARCHAR(191) NOT NULL,
      accessKey VARCHAR(191) NOT NULL,
      userStatus VARCHAR(60) NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE(email)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

function createResetPasswordRequestTableIfNotExists(
  db: knex.Transaction
): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.RESET_PASSWORD_REQUEST} (
      userId VARCHAR(60) PRIMARY KEY NOT NULL,
      resetPasswordKey VARCHAR(191) NOT NULL,
      expiredAt DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES ${TableName.USER}(userId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
