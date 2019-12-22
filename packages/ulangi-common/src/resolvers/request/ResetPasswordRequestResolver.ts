/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ResetPasswordRequest } from '../../interfaces/request/ResetPasswordRequest';
import { RequestResolver } from './RequestResolver';

export class ResetPasswordRequestResolver extends RequestResolver<
  ResetPasswordRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      resetPasswordToken: Joi.string(),
      newPassword: Joi.string(),
    },
  };
}
