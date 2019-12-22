/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { TranslateRequest } from '../../interfaces/request/TranslateRequest';
import { RequestResolver } from './RequestResolver';

export class TranslateRequestResolver extends RequestResolver<
  TranslateRequest
> {
  protected rules = {
    query: {
      sourceText: Joi.string(),
      sourceLanguageCode: Joi.string(),
      translatedToLanguageCode: Joi.string(),
      translator: Joi.string(),
    },
    body: Joi.strip(),
  };
}
