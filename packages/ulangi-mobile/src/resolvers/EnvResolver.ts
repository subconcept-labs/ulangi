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
    ENABLE_LOGGING: Joi.boolean(),
    ENABLE_SPLASH_SCREEN: Joi.boolean(),
    SERVER_URL: Joi.string(),
    API_URL: Joi.string(),
    PRIVACY_POLICY_URL: Joi.string().allow(null),
    APPLE_APP_ID: Joi.string().allow(null),
    GOOGLE_PACKAGE_NAME: Joi.string().allow(null),
    ADMOB_PUBLISHER_ID: Joi.string().allow(null),
    CONSENT_FORM_SHOULD_OFFER_AD_FREE: Joi.boolean().allow(null),
    CONSENT_FORM_DEBUG_GEOGRAPHY: Joi.string()
      .valid(['EEA', 'NOT_EEA'])
      .allow(null),
    IOS_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string().allow(null),
    IOS_AD_APP_ID: Joi.string().allow(null),
    IOS_AD_UNIT_ID: Joi.string().allow(null),
    IOS_AD_TEST_DEVICE_ID: Joi.string().allow(null),
    IOS_CONSENT_FORM_DEBUG_DEVICE_ID: Joi.string().allow(null),
    ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string().allow(null),
    ANDROID_AD_APP_ID: Joi.string().allow(null),
    ANDROID_AD_UNIT_ID: Joi.string().allow(null),
    ANDROID_AD_TEST_DEVICE_ID: Joi.string().allow(null),
    ANDROID_CONSENT_FORM_DEBUG_DEVICE_ID: Joi.string().allow(null),
    FLASHCARD_PLAYER_URL: Joi.string().allow(null),
  };
}
