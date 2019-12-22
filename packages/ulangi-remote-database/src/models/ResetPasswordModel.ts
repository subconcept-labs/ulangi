/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as knex from 'knex';

import { TableName } from '../enums/TableName';
import { ResetPasswordRequestRow } from '../interfaces/ResetPasswordRequestRow';
import { promisifyQuery } from '../utils/promisifyQuery';

export class ResetPasswordModel {
  public upsertResetPasswordRequest(
    db: knex.Transaction,
    resetPasswordRequestRow: Omit<ResetPasswordRequestRow, 'expiredAt'>,
    expirationHours: number
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const { userId, resetPasswordKey } = resetPasswordRequestRow;
          await promisifyQuery(
            db.raw(
              `
              INSERT INTO ${TableName.RESET_PASSWORD_REQUEST} 
                (userId, resetPasswordKey, expiredAt)
                VALUES (?, ?, DATE_ADD(now() , INTERVAL ${expirationHours} HOUR))
              ON DUPLICATE KEY UPDATE 
                resetPasswordKey = VALUES(resetPasswordKey),
                expiredAt = VALUES(expiredAt)
              `,
              [userId, resetPasswordKey]
            )
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public isResetPasswordRequestValid(
    db: knex | knex.Transaction,
    userId: string,
    resetPasswordKey: string
  ): Promise<boolean> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.RESET_PASSWORD_REQUEST)
              .where({ userId, resetPasswordKey })
              .andWhereRaw('NOW() <= expiredAt')
          );
          if (result.length === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public deleteResetPasswordRequest(
    db: knex.Transaction,
    userId: string
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          await promisifyQuery(
            db
              .delete()
              .from(TableName.RESET_PASSWORD_REQUEST)
              .where({ userId })
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
