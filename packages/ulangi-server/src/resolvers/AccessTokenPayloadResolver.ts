/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { AccessTokenPayload } from '../interfaces/AccessTokenPayload';

export class AccessTokenPayloadResolver extends AbstractResolver<
  AccessTokenPayload
> {
  protected rules = {
    userId: Joi.string(),
    accessKey: Joi.string(),
  };
}
