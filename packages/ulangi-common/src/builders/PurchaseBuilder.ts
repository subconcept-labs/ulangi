/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';

import { IapService } from '../enums/IapService';
import { Purchase } from '../interfaces/general/Purchase';

export class PurchaseBuilder {
  public build(purchase: DeepPartial<Purchase>): Purchase {
    return _.merge(
      {
        transactionId: uuid.v4(),
        service: IapService.APPLE,
        productId: uuid.v4(),
        purchaseDate: moment().toDate(),
        quantity: 1,
        cancellationDate: null,
        expirationDate: null,
        originalTransactionId: null,
        originalPurchaseDate: null,
      },
      purchase
    );
  }
}
