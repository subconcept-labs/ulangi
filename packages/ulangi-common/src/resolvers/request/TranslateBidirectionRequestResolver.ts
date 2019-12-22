/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { TranslateBidirectionRequest } from '../../interfaces/request/TranslateBidirectionRequest';
import { RequestResolver } from './RequestResolver';

export class TranslateBidirectionRequestResolver extends RequestResolver<
  TranslateBidirectionRequest
> {
  protected rules = {
    query: {
      sourceText: Joi.string(),
      languageCodePair: Joi.string().regex(/^\w{2}-\w{2}$/),
    },
    body: Joi.strip(),
  };
}
