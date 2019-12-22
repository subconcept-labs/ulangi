/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IapService } from '../../enums/IapService';

export interface Purchase {
  readonly transactionId: string;
  readonly service: IapService;
  readonly productId: string;
  readonly quantity: number;
  readonly purchaseDate: Date;
  readonly originalTransactionId: null | string;
  readonly originalPurchaseDate: null | Date;
  readonly cancellationDate: null | Date;
  readonly expirationDate: null | Date;
}
