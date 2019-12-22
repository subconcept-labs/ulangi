/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { SendApiKeyRequest } from '../../interfaces/request/SendApiKeyRequest';
import { RequestResolver } from './RequestResolver';

export class SendApiKeyRequestResolver extends RequestResolver<
  SendApiKeyRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      apiKey: Joi.string(),
      expiredAt: Joi.date().allow(null),
    },
  };
}
