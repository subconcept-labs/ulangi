/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { MappedRules } from '@ulangi/resolver';
import * as Joi from 'joi';

import { ChangePasswordRequest } from '../../interfaces/request/ChangePasswordRequest';
import { RequestResolver } from './RequestResolver';

export class ChangePasswordRequestResolver extends RequestResolver<
  ChangePasswordRequest
> {
  protected rules: MappedRules<Pick<ChangePasswordRequest, 'query' | 'body'>>;

  public constructor(passwordMinLength: number) {
    super();
    this.rules = {
      query: Joi.strip(),
      body: {
        currentPassword: Joi.string(),
        newPassword: Joi.string().min(passwordMinLength),
      },
    };
  }
}
