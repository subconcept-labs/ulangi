/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../../enums/TableName';

export async function migration_06(tx: knex.Transaction): Promise<void> {
  await createPurchaseTableIfNotExists(tx);
}

function createPurchaseTableIfNotExists(db: knex.Transaction): knex.Raw {
  return db.raw(`
    CREATE TABLE IF NOT EXISTS ${TableName.PURCHASE} (
      transactionId VARCHAR(191) NOT NULL,
      service VARCHAR(20) NOT NULL,
      productId VARCHAR(191) NOT NULL,
      userId VARCHAR(60) NOT NULL,
      purchaseDate DATETIME NOT NULL,
      quantity INT NOT NULL,
      originalTransactionId VARCHAR(191),
      originalPurchaseDate DATETIME,
      cancellationDate DATETIME,
      expirationDate DATETIME,
      PRIMARY KEY (transactionId, service),
      INDEX (userId),
      FOREIGN KEY (userId) REFERENCES ${TableName.USER}(userId)
    ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}
