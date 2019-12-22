/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { TranslationWithLanguages } from '../../interfaces/general/TranslationWithLanguages';

export class TranslationWithLanguagesResolver extends AbstractResolver<
  TranslationWithLanguages
> {
  protected rules = {
    sourceText: Joi.string(),
    sourceLanguageCode: Joi.string(),
    translatedText: Joi.string(),
    translatedLanguageCode: Joi.string(),
    translatedBy: Joi.string(),
  };
}
