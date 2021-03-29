/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Env {
  readonly SERVER_URL: string;
  readonly API_URL: string;
  readonly PRIVACY_POLICY_URL: string;

  readonly OPEN_SOURCE_ONLY: boolean;
  readonly ENABLE_REDUX_LOGGING: boolean;
  readonly ENABLE_SPLASH_SCREEN: boolean;

  readonly IOS_APP_ID: string;
  readonly ANDROID_PACKAGE_NAME: string;
  readonly ANDROID_STORE: string;
}
