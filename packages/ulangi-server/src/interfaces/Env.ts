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

  readonly AUTH_DATABASE_CONFIG: AuthDbConfig;
  readonly ALL_SHARD_DATABASE_CONFIG: readonly ShardDbConfig[];
  readonly SHARD_DATABASE_NAME_PREFIX: string;

  readonly JWT_SECRET_KEY: string;

  readonly ALERT_SERVICE_DISABLED: 'warn' | 'error' | 'off';

  readonly AWS_ACCESS_KEY_ID: undefined | string;
  readonly AWS_SECRET_ACCESS_KEY: undefined | string;
  readonly AWS_DEFAULT_REGION: undefined | string;
  readonly AWS_POLLY_REGION: undefined | string;
  readonly AWS_SES_REGION: undefined | string;

  readonly FIREBASE_SERVICE_ACCOUNT_PATH: undefined | string;
  readonly FIREBASE_DATABASE_URL: undefined | string;

  readonly GOOGLE_CLOUD_PROJECT_ID: undefined | string;
  readonly GOOGLE_CLOUD_SERVICE_ACCOUNT: undefined | string;

  readonly PLAY_STORE_SERVICE_ACCOUNT: undefined | string;
  readonly IOS_PREMIUM_LIFETIME_PRODUCT_ID: undefined | string;
  readonly ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: undefined | string;

  readonly LIBRARY_SERVER_URL: undefined | string;
  readonly LIBRARY_USE_AWS: undefined | boolean;
  readonly DICTIONARY_SERVER_URL: undefined | string;
  readonly DICTIONARY_USE_AWS: undefined | boolean;

  readonly PUBLIC_FOLDER_NAME: undefined | string;
}
