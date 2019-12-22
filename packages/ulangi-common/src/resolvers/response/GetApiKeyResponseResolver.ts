/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { GetApiKeyResponse } from '../../interfaces/response/GetApiKeyResponse';

export class GetApiKeyResponseResolver extends AbstractResolver<
  GetApiKeyResponse
> {
  protected rules = {
    apiKey: Joi.string().allow(null),
    expiredAt: Joi.date().allow(null),
  };
}
