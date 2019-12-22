/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { IapService } from '@ulangi/ulangi-common/enums';

export interface PurchaseRow {
  readonly transactionId: string;
  readonly service: IapService;
  readonly userId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly purchaseDate: Date;
  readonly originalTransactionId: null | string;
  readonly originalPurchaseDate: null | Date;
  readonly cancellationDate: null | Date;
  readonly expirationDate: null | Date;
}

export type PurchaseRowForInsert = PurchaseRow;
export type PurchaseRowForUpdate = DeepPartial<PurchaseRow>;
