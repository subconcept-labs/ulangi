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

  readonly ENABLE_REDUX_LOGGING: boolean;
  readonly ENABLE_SPLASH_SCREEN: boolean;

  readonly APPLE_APP_ID: string;
  readonly GOOGLE_PACKAGE_NAME: string;

  readonly IOS_PREMIUM_LIFETIME_PRODUCT_ID: undefined | string;
  readonly ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: undefined | string;

  readonly ADMOB_PUBLISHER_ID: undefined | string;
  readonly CONSENT_FORM_SHOULD_OFFER_AD_FREE: undefined | boolean;
  readonly CONSENT_FORM_DEBUG_GEOGRAPHY: undefined | 'EEA' | 'NOT_EEA';
  readonly IOS_AD_APP_ID: undefined | string;
  readonly IOS_AD_UNIT_ID: undefined | string;
  readonly IOS_AD_TEST_DEVICE_ID: undefined | string;
  readonly IOS_CONSENT_FORM_DEBUG_DEVICE_ID: undefined | string;
  readonly ANDROID_AD_APP_ID: undefined | string;
  readonly ANDROID_AD_UNIT_ID: undefined | string;
  readonly ANDROID_AD_TEST_DEVICE_ID: undefined | string;
  readonly ANDROID_CONSENT_FORM_DEBUG_DEVICE_ID: undefined | string;

  readonly FLASHCARD_PLAYER_URL: undefined | string;
}
