/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SendApiKeyResponse } from '../../interfaces/response/SendApiKeyResponse';

export class SendApiKeyResponseResolver extends AbstractResolver<
  SendApiKeyResponse
> {
  protected rules = {
    success: Joi.boolean().valid(true),
  };
}
