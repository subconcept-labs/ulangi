/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AuthDbConfig, ShardDbConfig } from '@ulangi/ulangi-remote-database';

export interface Env {
  readonly LOG_VERBOSITY: number;

  readonly SERVER_URL: string;
  readonly API_URL: string;

  readonly PUBLIC_FOLDER_NAME: string;

  readonly JWT_SECRET_KEY: string;

  readonly AWS_ACCESS_KEY_ID: null | string;
  readonly AWS_SECRET_ACCESS_KEY: null | string;
  readonly AWS_DEFAULT_REGION: null | string;
  readonly AWS_POLLY_REGION: null | string;
  readonly AWS_SES_REGION: null | string;

  readonly AUTH_DATABASE_CONFIG: AuthDbConfig;
  readonly ALL_SHARD_DATABASE_CONFIG: readonly ShardDbConfig[];
  readonly SHARD_DATABASE_NAME_PREFIX: string;

  readonly FIREBASE_SERVICE_ACCOUNT_PATH: null | string;
  readonly FIREBASE_DATABASE_URL: null | string;

  readonly GOOGLE_CLOUD_PROJECT_ID: null | string;
  readonly GOOGLE_CLOUD_SERVICE_ACCOUNT: null | string;

  readonly PLAY_STORE_SERVICE_ACCOUNT: null | string;
  readonly IOS_PREMIUM_LIFETIME_PRODUCT_ID: null | string;
  readonly ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: null | string;

  readonly LIBRARY_SERVER_URL: null | string;
  readonly DICTIONARY_SERVER_URL: null | string;
}
