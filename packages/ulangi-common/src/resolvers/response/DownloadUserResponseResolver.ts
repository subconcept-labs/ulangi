/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { DownloadUserResponse } from '../../interfaces/response/DownloadUserResponse';
import { UserResolver } from '../general/UserResolver';

export class DownloadUserResponseResolver extends AbstractResolver<
  DownloadUserResponse
> {
  private currentUserResolver = new UserResolver();

  protected rules = {
    user: this.currentUserResolver.getRules(),
    currentUser: Joi.object(this.currentUserResolver.getRules()).optional(),
  };
}
