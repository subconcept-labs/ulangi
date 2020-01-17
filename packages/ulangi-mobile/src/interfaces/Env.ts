/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Env {
  readonly ENABLE_REDUX_LOGGING: boolean;
  readonly ENABLE_SPLASH_SCREEN: boolean;
  readonly SERVER_URL: string;
  readonly API_URL: string;
  readonly PRIVACY_POLICY_URL: null | string;
  readonly APPLE_APP_ID: null | string;
  readonly GOOGLE_PACKAGE_NAME: null | string;
  readonly ADMOB_PUBLISHER_ID: null | string;
  readonly CONSENT_FORM_SHOULD_OFFER_AD_FREE: null | boolean;
  readonly CONSENT_FORM_DEBUG_GEOGRAPHY: null | 'EEA' | 'NOT_EEA';
  readonly IOS_PREMIUM_LIFETIME_PRODUCT_ID: null | string;
  readonly IOS_AD_APP_ID: null | string;
  readonly IOS_AD_UNIT_ID: null | string;
  readonly IOS_AD_TEST_DEVICE_ID: null | string;
  readonly IOS_CONSENT_FORM_DEBUG_DEVICE_ID: null | string;
  readonly ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: null | string;
  readonly ANDROID_AD_APP_ID: null | string;
  readonly ANDROID_AD_UNIT_ID: null | string;
  readonly ANDROID_AD_TEST_DEVICE_ID: null | string;
  readonly ANDROID_CONSENT_FORM_DEBUG_DEVICE_ID: null | string;
  readonly FLASHCARD_PLAYER_URL: null | string;
}
