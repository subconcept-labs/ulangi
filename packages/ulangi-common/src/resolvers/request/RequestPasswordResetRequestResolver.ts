/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { RequestPasswordResetRequest } from '../../interfaces/request/RequestPasswordResetRequest';
import { RequestResolver } from './RequestResolver';

export class RequestPasswordResetRequestResolver extends RequestResolver<
  RequestPasswordResetRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      email: Joi.string(),
    },
  };
}
