/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { LanguagePair } from '../../interfaces/general/LanguagePair';

export class LanguagePairResolver extends AbstractResolver<LanguagePair> {
  protected rules = {
    learningLanguageCode: Joi.string(),
    translatedToLanguageCode: Joi.string(),
    builtInDictionary: Joi.boolean(),
    showPremadeFlashcards: Joi.boolean().optional(),
    disabled: Joi.boolean().optional(),
    priority: Joi.number().optional(),
  };
}
