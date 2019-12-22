/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { UploadUserRequest } from '../../interfaces/request/UploadUserRequest';
import { UserResolver } from '../general/UserResolver';
import { RequestResolver } from './RequestResolver';

export class UploadUserRequestResolver extends RequestResolver<
  UploadUserRequest
> {
  private userResolver = new UserResolver();

  protected rules = {
    query: Joi.strip(),
    body: {
      user: Joi.object(this.userResolver.getRules()).options({
        presence: 'optional',
      }),
    },
  };
}
