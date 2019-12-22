/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { IapService } from '../../enums/IapService';
import { Purchase } from '../../interfaces/general/Purchase';

export class PurchaseResolver extends AbstractResolver<Purchase> {
  protected rules = {
    transactionId: Joi.string(),
    service: Joi.string().valid(_.values(IapService)),
    productId: Joi.string(),
    quantity: Joi.number(),
    purchaseDate: Joi.date(),
    originalTransactionId: Joi.string().allow(null),
    originalPurchaseDate: Joi.date().allow(null),
    cancellationDate: Joi.date().allow(null),
    expirationDate: Joi.date().allow(null),
  };
}
