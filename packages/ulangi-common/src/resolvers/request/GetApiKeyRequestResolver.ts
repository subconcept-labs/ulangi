/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';
import * as _ from 'lodash';

import { ApiScope } from '../../enums/ApiScope';
import { GetApiKeyRequest } from '../../interfaces/request/GetApiKeyRequest';
import { RequestResolver } from './RequestResolver';

export class GetApiKeyRequestResolver extends RequestResolver<
  GetApiKeyRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      password: Joi.string(),
      apiScope: Joi.string().valid(_.values(ApiScope)),
      createIfNotExists: Joi.boolean().optional(),
    },
  };
}
