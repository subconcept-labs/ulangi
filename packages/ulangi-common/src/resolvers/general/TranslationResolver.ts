/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { Translation } from '../../interfaces/general/Translation';

export class TranslationResolver extends AbstractResolver<Translation> {
  protected rules = {
    sourceText: Joi.string(),
    translatedText: Joi.string(),
    translatedBy: Joi.string(),
  };
}
