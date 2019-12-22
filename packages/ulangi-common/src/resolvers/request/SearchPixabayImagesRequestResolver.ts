/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { SearchPixabayImagesRequest } from '../../interfaces/request/SearchPixabayImagesRequest';
import { RequestResolver } from './RequestResolver';

export class SearchPixabayImagesRequestResolver extends RequestResolver<
  SearchPixabayImagesRequest
> {
  protected rules = {
    query: {
      q: Joi.string(),
      // eslint-disable-next-line @typescript-eslint/camelcase
      image_type: Joi.string(),
      page: Joi.number(),
      safesearch: Joi.boolean(),
    },
    body: Joi.strip(),
  };
}
