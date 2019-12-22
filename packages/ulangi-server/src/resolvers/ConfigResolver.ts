/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Config } from '../interfaces/Config';

export class ConfigResolver extends AbstractResolver<Config> {
  protected rules = {
    user: {
      passwordMinLength: Joi.number(),
      passwordEncryptionSaltRounds: Joi.number(),
      resetPasswordRequestExpirationHours: Joi.number(),
    },

    library: {
      fetchPublicSetMaxOffset: Joi.number(),
      fetchPublicVocabularyMaxOffset: Joi.number(),
    },

    pixabay: {
      apiUrl: Joi.string(),
      developerKey: Joi.string(),
      bucketName: Joi.string(),
      folderName: Joi.string(),
      imageUrl: Joi.string(),
    },

    languageMap: Joi.object().pattern(/^/, Joi.string()),

    googleTextToSpeech: {
      defaultVoices: Joi.object().pattern(
        /^/,
        Joi.object({
          voiceName: Joi.string(),
          languageCode: Joi.string(),
        })
      ),
    },

    polly: {
      defaultVoices: Joi.object().pattern(
        /^/,
        Joi.object({
          voiceId: Joi.string(),
          languageCode: Joi.string(),
        })
      ),
    },
  };
}
