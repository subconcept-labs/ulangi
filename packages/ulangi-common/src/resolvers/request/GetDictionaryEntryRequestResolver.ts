/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { GetDictionaryEntryRequest } from '../../interfaces/request/GetDictionaryEntryRequest';
import { RequestResolver } from './RequestResolver';

export class GetDictionaryEntryRequestResolver extends RequestResolver<
  GetDictionaryEntryRequest
> {
  protected rules = {
    query: {
      searchTerm: Joi.string(),
      searchTermLanguageCode: Joi.string(),
      translatedToLanguageCode: Joi.string(),
    },
    body: Joi.strip(),
  };
}
