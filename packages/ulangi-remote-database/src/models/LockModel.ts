/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { LockType } from '../enums/LockType';
import { TableName } from '../enums/TableName';
import { promisifyQuery } from '../utils/promisifyQuery';

export class LockModel {
  public acquireLock(
    db: knex | knex.Transaction,
    userId: string,
    lockName: LockType
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await promisifyQuery(
            db.raw(
              `INSERT INTO ${
                TableName.LOCK
              } (userId, lockName) VALUES (?, ?) ON DUPLICATE KEY UPDATE userId = VALUES(userId), lockName = VALUES(lockName)`,
              [userId, lockName]
            )
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
