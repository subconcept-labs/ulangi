/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { GetPublicSetCountRequest } from '../../interfaces/request/GetPublicSetCountRequest';
import { RequestResolver } from './RequestResolver';

export class GetPublicSetCountRequestResolver extends RequestResolver<
  GetPublicSetCountRequest
> {
  protected rules = {
    query: {
      languageCodePair: Joi.string(),
    },
    body: Joi.strip(),
  };
}
