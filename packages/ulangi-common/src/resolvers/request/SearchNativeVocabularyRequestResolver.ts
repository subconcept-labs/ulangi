/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { SearchNativeVocabularyRequest } from '../../interfaces/request/SearchNativeVocabularyRequest';
import { RequestResolver } from './RequestResolver';

export class SearchNativeVocabularyRequestResolver extends RequestResolver<
  SearchNativeVocabularyRequest
> {
  protected rules = {
    query: {
      languageCodePair: Joi.string(),
      searchTerm: Joi.string(),
      offset: Joi.number(),
      limit: Joi.number(),
    },
    body: Joi.strip(),
  };
}
