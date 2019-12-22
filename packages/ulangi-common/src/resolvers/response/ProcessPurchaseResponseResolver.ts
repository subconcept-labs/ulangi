/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { ProcessPurchaseResponse } from '../../interfaces/response/ProcessPurchaseResponse';
import { PurchaseResolver } from '../general/PurchaseResolver';

export class ProcessPurchaseResponseResolver extends AbstractResolver<
  ProcessPurchaseResponse
> {
  private purchaseResolver = new PurchaseResolver();

  protected rules = {
    purchasesSuccessfullyApplied: Joi.array().items(
      this.purchaseResolver.getRules()
    ),
    purchasesAlreadyApplied: Joi.array().items(
      this.purchaseResolver.getRules()
    ),
    purchasesAlreadyAppliedToOtherAccounts: Joi.array().items(
      this.purchaseResolver.getRules()
    ),
  };
}
