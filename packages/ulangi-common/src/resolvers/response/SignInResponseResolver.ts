/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SignInResponse } from '../../interfaces/response/SignInResponse';
import { UserResolver } from '../general/UserResolver';

export class SignInResponseResolver extends AbstractResolver<SignInResponse> {
  private currentUserResolver = new UserResolver();

  protected rules = {
    currentUser: this.currentUserResolver.getRules(),
    accessToken: Joi.string(),
  };
}
