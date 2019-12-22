/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PurchaseBuilder, UserBuilder } from '@ulangi/ulangi-common/builders';
import { Purchase, User } from '@ulangi/ulangi-common/interfaces';
import { mockCurrentTime } from '@ulangi/ulangi-common/testing-utils';
import * as knex from 'knex';
import * as moment from 'moment';
import * as short from 'short-uuid';

import { DatabaseFacade } from '../facades/DatabaseFacade';
import { ModelFactory } from '../factories/ModelFactory';
import { PurchaseModel } from '../models/PurchaseModel';
import { UserModel } from '../models/UserModel';
import { resolveEnv } from '../setup/resolveEnv';

describe('PurchaseModel', (): void => {
  const env = resolveEnv();

  let userId: string;
  let restoreCurrentTime: () => void;

  beforeEach(
    async (): Promise<void> => {
      userId = short.generate();
      restoreCurrentTime = mockCurrentTime();
    }
  );

  afterEach(
    (): void => {
      restoreCurrentTime();
    }
  );

  describe('Tests start with connected database', (): void => {
    let databaseFacade: DatabaseFacade;
    let authDb: knex;
    let modelFactory: ModelFactory;
    let userModel: UserModel;
    let purchaseModel: PurchaseModel;

    beforeEach(
      async (): Promise<void> => {
        databaseFacade = new DatabaseFacade(
          env.AUTH_DATABASE_CONFIG,
          env.ALL_SHARD_DATABASE_CONFIG,
          env.SHARD_DATABASE_NAME_PREFIX
        );

        await databaseFacade.checkAuthDatabaseTables();
        authDb = databaseFacade.getDb('auth');

        modelFactory = new ModelFactory();
        userModel = modelFactory.createModel('userModel');
        purchaseModel = modelFactory.createModel('purchaseModel');
      }
    );

    afterEach(
      async (): Promise<void> => {
        await databaseFacade.closeAllDatabases();
      }
    );

    test('upsert purchase failed due to foreign contraints', async (): Promise<
      void
    > => {
      const purchases = Array(4)
        .fill(null)
        .map(
          (): Purchase => {
            return new PurchaseBuilder().build({
              cancellationDate: moment()
                .add(2, 'hours')
                .toDate(),
              expirationDate: moment()
                .add(3, 'hours')
                .toDate(),
              originalTransactionId: 'originalTransactionId',
              originalPurchaseDate: moment()
                .add(4, 'hours')
                .toDate(),
            });
          }
        );

      await authDb.transaction(
        async (tx): Promise<void> => {
          return purchaseModel.upsertPurchases(tx, 'unknownUserId', purchases);
        }
      );

      const {
        purchases: fetchedPurchases,
      } = await purchaseModel.getPurchasesByUserId(
        authDb,
        'unknownUserId',
        true
      );

      expect(fetchedPurchases).toEqual([]);
    });

    describe('Tests start after inserting user', (): void => {
      let user: User;
      let accessKey: string;

      beforeEach(
        async (): Promise<void> => {
          accessKey = short.generate();
          user = new UserBuilder().build({
            userId,
            email: short.uuid() + '@ulangi.com',
          });

          await authDb.transaction(
            async (tx): Promise<void> => {
              return userModel.insertUser(
                tx,
                user,
                env.ALL_SHARD_DATABASE_CONFIG[0].shardId,
                'password',
                accessKey
              );
            }
          );
        }
      );

      test('upsert new purchases', async (): Promise<void> => {
        const purchases = Array(4)
          .fill(null)
          .map(
            (): Purchase => {
              return new PurchaseBuilder().build({
                cancellationDate: moment()
                  .add(2, 'hours')
                  .toDate(),
                expirationDate: moment()
                  .add(3, 'hours')
                  .toDate(),
                originalTransactionId: 'originalTransactionId',
                originalPurchaseDate: moment()
                  .add(4, 'hours')
                  .toDate(),
              });
            }
          );

        await authDb.transaction(
          async (tx): Promise<void> => {
            return purchaseModel.upsertPurchases(tx, userId, purchases);
          }
        );

        const {
          purchases: fetchedPurchases,
        } = await purchaseModel.getPurchasesByUserId(authDb, userId, true);

        expect(fetchedPurchases).toIncludeSameMembers(purchases);
      });

      test('get purchases applied to other accounts', async (): Promise<
        void
      > => {
        const accessKey = short.generate();
        const anotherUser = new UserBuilder().build({
          userId: short.uuid(),
          email: short.uuid() + '@ulangi.com',
        });

        await authDb.transaction(
          async (tx): Promise<void> => {
            return userModel.insertUser(
              tx,
              anotherUser,
              env.ALL_SHARD_DATABASE_CONFIG[0].shardId,
              'password',
              accessKey
            );
          }
        );

        const purchasesOwnedByAnotherUser = Array(4)
          .fill(null)
          .map(
            (): Purchase => {
              return new PurchaseBuilder().build({});
            }
          );

        const purchasesOwnedByCurrentUser = Array(4)
          .fill(null)
          .map(
            (): Purchase => {
              return new PurchaseBuilder().build({});
            }
          );

        await authDb.transaction(
          async (tx): Promise<void[]> => {
            return Promise.all([
              purchaseModel.upsertPurchases(
                tx,
                anotherUser.userId,
                purchasesOwnedByAnotherUser
              ),
              purchaseModel.upsertPurchases(
                tx,
                userId,
                purchasesOwnedByCurrentUser
              ),
            ]);
          }
        );

        // Original transaction ids of purchase belongs to another user
        const purchasesWithOriginalTransactionIdsOfAnotherUser = purchasesOwnedByAnotherUser.map(
          (purchase): Purchase => {
            return new PurchaseBuilder().build({
              originalTransactionId: purchase.transactionId,
            });
          }
        );

        expect(
          await purchaseModel.getPurchasesAppliedToOtherAccounts(
            authDb,
            userId,
            [
              ...purchasesOwnedByCurrentUser,
              ...purchasesOwnedByAnotherUser,
              ...purchasesWithOriginalTransactionIdsOfAnotherUser,
            ]
          )
        ).toIncludeSameMembers([
          ...purchasesOwnedByAnotherUser,
          ...purchasesWithOriginalTransactionIdsOfAnotherUser,
        ]);

        expect(
          await purchaseModel.getPurchasesAppliedToOtherAccounts(
            authDb,
            anotherUser.userId,
            [
              ...purchasesOwnedByCurrentUser,
              ...purchasesOwnedByAnotherUser,
              ...purchasesWithOriginalTransactionIdsOfAnotherUser,
            ]
          )
        ).toEqual(purchasesOwnedByCurrentUser);
      });

      describe('Tests start after insert purchases', (): void => {
        let purchases: Purchase[];

        beforeEach(
          async (): Promise<void> => {
            purchases = Array(4)
              .fill(null)
              .map(
                (): Purchase => {
                  return new PurchaseBuilder().build({});
                }
              );

            await authDb.transaction(
              async (tx): Promise<void> => {
                return purchaseModel.upsertPurchases(tx, userId, purchases);
              }
            );
          }
        );

        test('upsert existing purchases', async (): Promise<void> => {
          const editedPurchases = purchases.map(
            (purchase): Purchase => {
              return {
                ...purchase,
                productId: 'editedProductId',
                purchaseDate: moment()
                  .add(1, 'day')
                  .toDate(),
                quantity: 1,
                cancellationDate: moment()
                  .add(2, 'days')
                  .toDate(),
                expirationDate: moment()
                  .add(3, 'days')
                  .toDate(),
                originalTransactionId: 'editedOriginalTransactionId',
                originalPurchaseDate: moment()
                  .add(4, 'days')
                  .toDate(),
              };
            }
          );

          await authDb.transaction(
            async (tx): Promise<void> => {
              return purchaseModel.upsertPurchases(tx, userId, editedPurchases);
            }
          );

          const {
            purchases: fetchedPurchases,
          } = await purchaseModel.getPurchasesByUserId(authDb, userId, true);

          expect(fetchedPurchases).toIncludeSameMembers(editedPurchases);
        });

        test('get purchases', async (): Promise<void> => {
          const {
            purchases: fetchedPurchases,
          } = await purchaseModel.getPurchasesByUserId(authDb, userId, true);

          expect(fetchedPurchases).toIncludeSameMembers(purchases);
        });
      });
    });
  });
});
