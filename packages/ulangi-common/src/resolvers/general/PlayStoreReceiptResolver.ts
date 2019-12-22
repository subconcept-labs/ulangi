/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { PlayStoreReceipt } from '../../interfaces/general/PlayStoreReceipt';

export class PlayStoreReceiptResolver extends AbstractResolver<
  PlayStoreReceipt
> {
  protected rules = {
    packageName: Joi.string(),
    productId: Joi.string(),
    purchaseToken: Joi.string(),
    subscription: Joi.boolean(),
  };
}
