/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IapService } from '@ulangi/ulangi-common/enums';
import { Purchase } from '@ulangi/ulangi-common/interfaces';
import * as iap from 'in-app-purchase';
import * as _ from 'lodash';
import * as moment from 'moment';

export class PurchasedItemConverter {
  public convertToPurchase(
    purchasedItem: iap.PurchasedItem,
    service: IapService
  ): Purchase {
    return {
      transactionId: purchasedItem.transactionId,
      service,
      productId: purchasedItem.productId,
      quantity: purchasedItem.quantity,
      purchaseDate: _.isNumber(purchasedItem.purchaseDate)
        ? moment(purchasedItem.purchaseDate).toDate()
        : moment(_.get(purchasedItem, 'purchaseDateMs')).toDate(),
      originalTransactionId: purchasedItem.originalTransactionId || null,
      originalPurchaseDate: _.has(purchasedItem, 'originalPurchaseDateMs')
        ? moment(_.get(purchasedItem, 'originalPurchaseDateMs')).toDate()
        : null,
      cancellationDate:
        typeof purchasedItem.cancellationDate !== 'undefined' &&
        purchasedItem.cancellationDate !== 0
          ? moment(purchasedItem.cancellationDate).toDate()
          : null,
      expirationDate:
        typeof purchasedItem.expirationDate !== 'undefined' &&
        purchasedItem.expirationDate !== 0
          ? moment(purchasedItem.expirationDate).toDate()
          : null,
    };
  }
}
