/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IapService, UserMembership } from '@ulangi/ulangi-common/enums';
import { Purchase, User } from '@ulangi/ulangi-common/interfaces';
import { Receipt } from '@ulangi/ulangi-common/types';
import { PurchaseModel, UserModel } from '@ulangi/ulangi-remote-database';
import * as appRoot from 'app-root-path';
import * as iap from 'in-app-purchase';
import * as knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as path from 'path';

import { PurchasedItemConverter } from '../converters/PurchasedItemConverter';

export class IapAdapter {
  private purchasedItemConverter = new PurchasedItemConverter();

  private userModel: UserModel;
  private purchaseModel: PurchaseModel;
  private playStoreServiceAccountPath: string;
  private supportedProductIds: readonly string[];
  private premiumLifetimeProductIds: readonly string[];

  public constructor(
    userModel: UserModel,
    purchaseModel: PurchaseModel,
    playStoreServiceAccountPath: string,
    iosPremiumLifetimeProductId: string,
    androidPremiumLifetimeProductId: string
  ) {
    this.userModel = userModel;
    this.purchaseModel = purchaseModel;
    this.playStoreServiceAccountPath = playStoreServiceAccountPath;
    this.supportedProductIds = [
      iosPremiumLifetimeProductId,
      androidPremiumLifetimeProductId,
    ];
    this.premiumLifetimeProductIds = [
      iosPremiumLifetimeProductId,
      androidPremiumLifetimeProductId,
    ];
  }

  public async setup(): Promise<void> {
    // eslint-disable-next-line
    const googleServiceAccount = require(path.join(
      appRoot.toString(),
      this.playStoreServiceAccountPath
    ));

    iap.config({
      googleServiceAccount: {
        privateKey: googleServiceAccount.private_key,
        clientEmail: googleServiceAccount.client_email,
      },
    } as any);

    iap.setup();
  }

  public async validateAndGetPurchases(
    receipt: Receipt
  ): Promise<null | Purchase[]> {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        try {
          const validationResponse = await iap.validate(receipt as any);
          const purchasedItems = iap.getPurchaseData(validationResponse);

          if (purchasedItems === null) {
            resolve(null);
          } else {
            const purchases = purchasedItems
              .filter(
                (item): boolean => {
                  return _.includes(this.supportedProductIds, item.productId);
                }
              )
              .map(
                (item): Purchase => {
                  return this.purchasedItemConverter.convertToPurchase(
                    item,
                    validationResponse.service as IapService
                  );
                }
              );
            resolve(purchases);
          }
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  public async applyPremiumLifetimePurchases(
    tx: knex.Transaction,
    user: User,
    purchases: readonly Purchase[]
  ): Promise<{
    purchasesSuccessfullyApplied: readonly Purchase[];
    purchasesAlreadyApplied: readonly Purchase[];
  }> {
    const premiumLifetimePurchases = purchases.filter(
      (purchase): boolean => {
        return this.isPremiumLifetimePurchase(purchase);
      }
    );

    const purchasesAlreadyApplied = premiumLifetimePurchases.filter(
      (): boolean => {
        return user.membership === UserMembership.LIFETIME_PREMIUM;
      }
    );

    const purchasesToBeApplied = _.differenceBy(
      premiumLifetimePurchases,
      purchasesAlreadyApplied,
      'transactionId'
    );

    if (purchasesToBeApplied.length > 0) {
      await Promise.all([
        this.purchaseModel.upsertPurchases(
          tx,
          user.userId,
          premiumLifetimePurchases
        ),
        this.userModel.updateUser(
          tx,
          {
            userId: user.userId,
            updatedAt: moment().toDate(),
            membership: UserMembership.LIFETIME_PREMIUM,
            membershipExpiredAt: null,
          },
          undefined,
          undefined
        ),
      ]);
    }

    return Promise.resolve({
      purchasesSuccessfullyApplied: purchasesToBeApplied,
      purchasesAlreadyApplied,
    });
  }

  public isPremiumLifetimePurchase(purchase: Purchase): boolean {
    return _.includes(this.premiumLifetimeProductIds, purchase.productId);
  }
}
