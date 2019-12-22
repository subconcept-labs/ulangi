/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Env {
  readonly ENABLE_LOGGING: boolean;
  readonly ENABLE_SPLASH_SCREEN: boolean;
  readonly SERVER_URL: string;
  readonly API_URL: string;
  readonly PRIVACY_POLICY_URL: string;
  readonly APPLE_APP_ID: string;
  readonly GOOGLE_PACKAGE_NAME: string;
  readonly ADMOB_PUBLISHER_ID: string;
  readonly CONSENT_FORM_SHOULD_OFFER_AD_FREE: boolean;
  readonly CONSENT_FORM_DEBUG_GEOGRAPHY?: 'EEA' | 'NOT_EEA';
  readonly DEBUG_APPS_FLYER: boolean;
  readonly IOS_APPS_FLYER_DEV_KEY: string;
  readonly IOS_PREMIUM_LIFETIME_PRODUCT_ID: string;
  readonly IOS_AD_APP_ID: string;
  readonly IOS_AD_UNIT_ID: string;
  readonly IOS_AD_TEST_DEVICE_ID?: string;
  readonly IOS_CONSENT_FORM_DEBUG_DEVICE_ID?: string;
  readonly ANDROID_APPS_FLYER_DEV_KEY: string;
  readonly ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: string;
  readonly ANDROID_AD_APP_ID: string;
  readonly ANDROID_AD_UNIT_ID: string;
  readonly ANDROID_AD_TEST_DEVICE_ID?: string;
  readonly ANDROID_CONSENT_FORM_DEBUG_DEVICE_ID?: string;
  readonly FLASHCARD_PLAYER_URL: string;
}
