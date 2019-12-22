/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { SignInRequest } from '../../interfaces/request/SignInRequest';
import { RequestResolver } from './RequestResolver';

export class SignInRequestResolver extends RequestResolver<SignInRequest> {
  protected rules = {
    query: Joi.strip(),
    body: {
      email: Joi.string().email(),
      password: Joi.string(),
    },
  };
}
