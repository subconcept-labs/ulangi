/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { Purchase } from '@ulangi/ulangi-common/interfaces';
import * as knex from 'knex';
import * as _ from 'lodash';

import { TableName } from '../enums/TableName';
import { PurchaseRow } from '../interfaces/PurchaseRow';
import { PurchaseRowPreparer } from '../preparers/PurchaseRowPreparer';
import { PurchaseRowResolver } from '../resolvers/PurchaseRowResolver';
import { promisifyQuery } from '../utils/promisifyQuery';

export class PurchaseModel {
  private purchaseRowResolver = new PurchaseRowResolver();
  private purchaseRowPreparer = new PurchaseRowPreparer();

  public async getPurchasesByUserId(
    db: knex | knex.Transaction | knex.QueryBuilder,
    userId: string,
    stripUnknown: boolean
  ): Promise<{ purchases: readonly Purchase[] }> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          // check if transactionId or originalTransactionId belongs to a different user
          const result = await promisifyQuery(
            db
              .select()
              .from(TableName.PURCHASE)
              .where({ userId })
          );

          const purchases = this.purchaseRowResolver
            .resolveArray(result, stripUnknown)
            .map(
              (row): Purchase => {
                return _.omit(row, 'userId');
              }
            );

          resolve({ purchases });
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async getPurchasesAppliedToOtherAccounts(
    db: knex | knex.Transaction | knex.QueryBuilder,
    currentUserId: string,
    purchases: readonly Purchase[]
  ): Promise<readonly Purchase[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const services = _.uniq(
            purchases.map(
              (purchase): string => {
                return purchase.service;
              }
            )
          );

          if (services.length !== 1) {
            reject(
              'rejectPurchasesOwnedByOtherUsers accepts a single service. No or multiple services found in purchase list'
            );
          } else {
            const service = services[0];

            // check if transactionId or originalTransactionId belongs to a different user
            const result = await promisifyQuery(
              db
                .select()
                .from(TableName.PURCHASE)
                .whereNot({ userId: currentUserId })
                .where({ service })
                .whereIn('transactionId', [
                  ...purchases.map(
                    (purchase): string => {
                      return purchase.transactionId;
                    }
                  ),
                  ...purchases
                    .filter(
                      (purchase): boolean => {
                        return purchase.originalTransactionId !== null;
                      }
                    )
                    .map(
                      (purchase): string => {
                        return assertExists(purchase.originalTransactionId);
                      }
                    ),
                ])
            );

            const existingPurchasesOfOtherAccounts = this.purchaseRowResolver.resolveArray(
              result,
              true
            );
            console.log(existingPurchasesOfOtherAccounts);

            const purchasesAppliedToOtherAccounts = purchases.filter(
              (purchase): boolean => {
                return (
                  existingPurchasesOfOtherAccounts.findIndex(
                    (existingPurchase): boolean => {
                      return (
                        existingPurchase.transactionId ===
                          purchase.transactionId ||
                        existingPurchase.transactionId ===
                          purchase.originalTransactionId
                      );
                    }
                  ) !== -1
                );
              }
            );

            console.log(purchasesAppliedToOtherAccounts);
            resolve(purchasesAppliedToOtherAccounts);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async upsertPurchases(
    db: knex.Transaction,
    userId: string,
    purchase: readonly Purchase[]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: (Promise<void | void[]>)[] = [];

          queries.push(
            this.insertOrIgnorePurchases(
              db,
              userId,
              purchase.filter(
                (purchase): boolean => {
                  return this.purchaseRowPreparer.canPrepareInsert(
                    userId,
                    purchase
                  );
                }
              )
            )
          );

          queries.push(this.updatePurchases(db, userId, purchase));

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private async insertOrIgnorePurchases(
    db: knex.Transaction,
    userId: string,
    purchases: readonly Purchase[]
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          if (purchases.length > 0) {
            const rows = purchases.map(
              (purchase): PurchaseRow => {
                return this.purchaseRowPreparer.prepareInsert(userId, purchase);
              }
            );

            const { sql, bindings } = db(TableName.PURCHASE)
              .insert(rows)
              .toSQL();

            queries.push(
              promisifyQuery(
                db.raw(sql.replace('insert', 'insert ignore'), bindings)
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  private updatePurchases(
    db: knex.Transaction,
    userId: undefined | string,
    purchase: readonly DeepPartial<Purchase>[]
  ): Promise<void[]> {
    return Promise.all(
      purchase.map(
        (purchase): Promise<void> => {
          return this.updatePurchase(db, userId, purchase);
        }
      )
    );
  }

  private updatePurchase(
    db: knex.Transaction,
    userId: undefined | string,
    purchase: DeepPartial<Purchase>
  ): Promise<void> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const queries: Promise<void>[] = [];

          const row = this.purchaseRowPreparer.prepareUpdate(userId, purchase);

          const { transactionId, service } = row;
          const updateFields = _.omit(row, ['transactionId', 'service']);

          if (!_.isEmpty(updateFields)) {
            queries.push(
              promisifyQuery(
                db
                  .update(updateFields)
                  .table(TableName.PURCHASE)
                  .where({
                    transactionId,
                    service,
                  })
              )
            );
          }

          await Promise.all(queries);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    );
  }
}
