/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { ResetPasswordResponse } from '../../interfaces/response/ResetPasswordResponse';

export class ResetPasswordResponseResolver extends AbstractResolver<
  ResetPasswordResponse
> {
  protected rules = {
    success: Joi.boolean().valid(true),
  };
}
