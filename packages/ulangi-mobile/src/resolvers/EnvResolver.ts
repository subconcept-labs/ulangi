/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Env } from '../interfaces/Env';

export class EnvResolver extends AbstractResolver<Env> {
  protected rules = {
    SERVER_URL: Joi.string(),
    API_URL: Joi.string(),
    PRIVACY_POLICY_URL: Joi.string(),

    OPEN_SOURCE_ONLY: Joi.boolean(),
    ENABLE_REDUX_LOGGING: Joi.boolean(),
    ENABLE_SPLASH_SCREEN: Joi.boolean(),

    IOS_APP_ID: Joi.string(),
    ANDROID_PACKAGE_NAME: Joi.string(),
    ANDROID_STORE: Joi.string(),
  };
}
