/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import {
  AuthDbConfigResolver,
  ShardDbConfigResolver,
} from '@ulangi/ulangi-remote-database';
import * as Joi from 'joi';

import { Env } from '../interfaces/Env';

export class EnvResolver extends AbstractResolver<Env> {
  protected authDbConfigResolver = new AuthDbConfigResolver();
  protected shardDbConfigResolver = new ShardDbConfigResolver();

  protected rules = {
    LOG_VERBOSITY: Joi.number(),

    SERVER_URL: Joi.string(),
    API_URL: Joi.string(),

    AUTH_DATABASE_CONFIG: Joi.object(this.authDbConfigResolver.getRules()),
    ALL_SHARD_DATABASE_CONFIG: Joi.array().items(
      this.shardDbConfigResolver.getRules()
    ),
    SHARD_DATABASE_NAME_PREFIX: Joi.string(),

    JWT_SECRET_KEY: Joi.string(),

    AWS_ACCESS_KEY_ID: Joi.string().optional(),
    AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
    AWS_DEFAULT_REGION: Joi.string().optional(),
    AWS_POLLY_REGION: Joi.string().optional(),
    AWS_SES_REGION: Joi.string().optional(),

    FIREBASE_SERVICE_ACCOUNT_PATH: Joi.string().optional(),
    FIREBASE_DATABASE_URL: Joi.string().optional(),

    GOOGLE_CLOUD_PROJECT_ID: Joi.string().optional(),
    GOOGLE_CLOUD_SERVICE_ACCOUNT: Joi.string().optional(),

    PLAY_STORE_SERVICE_ACCOUNT: Joi.string().optional(),
    IOS_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string().optional(),
    ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string().optional(),

    LIBRARY_SERVER_URL: Joi.string().optional(),
    DICTIONARY_SERVER_URL: Joi.string().optional(),

    ALERT_SERVICE_DISABLED: Joi.string().valid(['warn', 'error', 'off']),

    PUBLIC_FOLDER_NAME: Joi.string().optional(),
  };
}
