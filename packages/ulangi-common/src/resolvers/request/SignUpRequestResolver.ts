/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { MappedRules } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SignUpRequest } from '../../interfaces/request/SignUpRequest';
import { RequestResolver } from './RequestResolver';

export class SignUpRequestResolver extends RequestResolver<SignUpRequest> {
  protected rules: MappedRules<Pick<SignUpRequest, 'query' | 'body'>>;

  public constructor(passwordMinLength: number) {
    super();
    this.rules = {
      query: Joi.strip(),
      body: {
        email: Joi.string().email(),
        password: Joi.string().min(passwordMinLength),
      },
    };
  }
}
