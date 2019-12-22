/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { IapService } from '@ulangi/ulangi-common/enums';
import { Purchase } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';

import {
  PurchaseRow,
  PurchaseRowForInsert,
  PurchaseRowForUpdate,
} from '../interfaces/PurchaseRow';

export class PurchaseRowPreparer extends AbstractPreparer<PurchaseRow> {
  protected insertRules: { [P in keyof PurchaseRow]: Joi.SchemaLike };
  protected updateRules: { [P in keyof PurchaseRow]: Joi.SchemaLike };

  public constructor() {
    super();

    this.insertRules = {
      transactionId: Joi.string(),
      service: Joi.string().valid(_.values(IapService)),
      userId: Joi.string(),
      productId: Joi.string(),
      quantity: Joi.number(),
      purchaseDate: Joi.date(),
      originalTransactionId: Joi.string().allow(null),
      originalPurchaseDate: Joi.date().allow(null),
      cancellationDate: Joi.date().allow(null),
      expirationDate: Joi.date().allow(null),
    };

    this.updateRules = {
      transactionId: Joi.string(),
      service: Joi.string().valid(_.values(IapService)),
      userId: Joi.string().optional(),
      productId: Joi.string().optional(),
      quantity: Joi.number().optional(),
      purchaseDate: Joi.date().optional(),
      originalTransactionId: Joi.string()
        .allow(null)
        .optional(),
      originalPurchaseDate: Joi.date()
        .allow(null)
        .optional(),
      cancellationDate: Joi.date()
        .allow(null)
        .optional(),
      expirationDate: Joi.date()
        .allow(null)
        .optional(),
    };
  }

  public canPrepareInsert(userId: string, purchase: Purchase): boolean {
    const row = this.convertToInsertRow(userId, purchase);

    return this.isValidData(row, this.insertRules);
  }

  public prepareInsert(userId: string, purchase: Purchase): PurchaseRow {
    const purchaseRow = this.convertToInsertRow(userId, purchase);

    return this.validateData(purchaseRow, this.insertRules) as PurchaseRow;
  }

  public prepareUpdate(
    userId: undefined | string,
    purchase: DeepPartial<Purchase>
  ): PurchaseRowForUpdate {
    const purchaseRow = this.convertToUpdateRow(userId, purchase);
    return this.validateData(
      purchaseRow,
      this.updateRules
    ) as PurchaseRowForUpdate;
  }

  private convertToInsertRow(
    userId: string,
    purchase: Purchase
  ): PurchaseRowForInsert {
    return {
      userId,
      transactionId: purchase.transactionId,
      service: purchase.service,
      productId: purchase.productId,
      quantity: purchase.quantity,
      purchaseDate: purchase.purchaseDate,
      originalTransactionId: purchase.originalTransactionId,
      originalPurchaseDate: purchase.originalPurchaseDate,
      cancellationDate: purchase.cancellationDate,
      expirationDate: purchase.expirationDate,
    };
  }

  private convertToUpdateRow(
    userId: undefined | string,
    purchase: DeepPartial<Purchase>
  ): PurchaseRowForUpdate {
    return {
      userId,
      transactionId: purchase.transactionId,
      service: purchase.service,
      productId: purchase.productId,
      quantity: purchase.quantity,
      purchaseDate: purchase.purchaseDate,
      originalTransactionId: purchase.originalTransactionId,
      originalPurchaseDate: purchase.originalPurchaseDate,
      cancellationDate: purchase.cancellationDate,
      expirationDate: purchase.expirationDate,
    };
  }
}
