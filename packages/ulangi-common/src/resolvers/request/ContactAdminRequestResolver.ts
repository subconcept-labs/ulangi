/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { ContactAdminRequest } from '../../interfaces/request/ContactAdminRequest';
import { RequestResolver } from './RequestResolver';

export class ContactAdminRequestResolver extends RequestResolver<
  ContactAdminRequest
> {
  protected rules = {
    query: Joi.strip(),
    body: {
      adminEmail: Joi.string().email(),
      replyToEmail: Joi.string().email(),
      subject: Joi.string(),
      message: Joi.string(),
    },
  };
}
