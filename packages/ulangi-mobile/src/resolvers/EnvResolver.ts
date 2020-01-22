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

    APPLE_APP_ID: Joi.string(),
    GOOGLE_PACKAGE_NAME: Joi.string(),

    IOS_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string().optional(),
    ANDROID_PREMIUM_LIFETIME_PRODUCT_ID: Joi.string().optional(),

    ADMOB_PUBLISHER_ID: Joi.string().optional(),
    CONSENT_FORM_SHOULD_OFFER_AD_FREE: Joi.boolean().optional(),
    CONSENT_FORM_DEBUG_GEOGRAPHY: Joi.string()
      .valid(['EEA', 'NOT_EEA'])
      .optional(),
    IOS_AD_APP_ID: Joi.string().optional(),
    IOS_AD_UNIT_ID: Joi.string().optional(),
    IOS_AD_TEST_DEVICE_ID: Joi.string().optional(),
    IOS_CONSENT_FORM_DEBUG_DEVICE_ID: Joi.string().optional(),
    ANDROID_AD_APP_ID: Joi.string().optional(),
    ANDROID_AD_UNIT_ID: Joi.string().optional(),
    ANDROID_AD_TEST_DEVICE_ID: Joi.string().optional(),
    ANDROID_CONSENT_FORM_DEBUG_DEVICE_ID: Joi.string().optional(),

    FLASHCARD_PLAYER_URL: Joi.string().optional(),
  };
}
