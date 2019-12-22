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
    PUBLIC_FOLDER_NAME: Joi.string(),

    AWS_ACCESS_KEY_ID: Joi.string(),
    AWS_SECRET_ACCESS_KEY: Joi.string(),
    AWS_DEFAULT_REGION: Joi.string(),
    AWS_POLLY_REGION: Joi.string(),
    AWS_SES_REGION: Joi.string(),

    AUTH_DATABASE_CONFIG: Joi.object(this.authDbConfigResolver.getRules()),
    ALL_SHARD_DATABASE_CONFIG: Joi.array().items(
      this.shardDbConfigResolver.getRules()
    ),
    SHARD_DATABASE_NAME_PREFIX: Joi.string(),

    FIREBASE_SERVICE_ACCOUNT_PATH: Joi.string(),
    FIREBASE_DATABASE_URL: Joi.string(),

    GOOGLE_CLOUD_PROJECT_ID: Joi.string(),
    GOOGLE_CLOUD_SERVICE_ACCOUNT: Joi.string(),

    PLAY_STORE_SERVICE_ACCOUNT: Joi.string(),
    IOS_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string(),
    ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string(),

    JWT_SECRET_KEY: Joi.string(),

    LIBRARY_SERVER_URL: Joi.string(),
    DICTIONARY_SERVER_URL: Joi.string(),
  };
}
