/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { SearchNativeSetsRequest } from '../../interfaces/request/SearchNativeSetsRequest';
import { RequestResolver } from './RequestResolver';

export class SearchNativeSetsRequestResolver extends RequestResolver<
  SearchNativeSetsRequest
> {
  protected rules = {
    query: {
      languageCodePair: Joi.string(),
      searchTerm: Joi.string().allow(''),
      offset: Joi.number(),
      limit: Joi.number(),
    },
    body: Joi.strip(),
  };
}
