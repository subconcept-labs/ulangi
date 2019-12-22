/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ProcessPurchaseRequest } from '../../interfaces/request/ProcessPurchaseRequest';
import { PlayStoreReceiptResolver } from '../general/PlayStoreReceiptResolver';
import { RequestResolver } from './RequestResolver';

export class ProcessPurchaseRequestResolver extends RequestResolver<
  ProcessPurchaseRequest
> {
  private playStoreReceiptResolver = new PlayStoreReceiptResolver();

  protected rules = {
    query: Joi.strip(),
    body: {
      receipt: Joi.alternatives().try(
        Joi.string(),
        this.playStoreReceiptResolver.getRules()
      ),
    },
  };
}
