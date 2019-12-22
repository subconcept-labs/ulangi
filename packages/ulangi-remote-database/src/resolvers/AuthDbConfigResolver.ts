/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { AuthDbConfig } from '../interfaces/AuthDbConfig';

export class AuthDbConfigResolver extends AbstractResolver<AuthDbConfig> {
  protected rules = {
    host: Joi.string(),
    port: Joi.number(),
    databaseName: Joi.string(),
    user: Joi.string(),
    password: Joi.string(),
    connectionLimit: Joi.number(),
  };
}
