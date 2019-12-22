/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SearchPixabayImagesResponse } from '../../interfaces/response/SearchPixabayImagesResponse';
import { PixabayImageResolver } from '../general/PixabayImageResolver';

export class SearchPixabayImagesResponseResolver extends AbstractResolver<
  SearchPixabayImagesResponse
> {
  private pixabayImageResolver = new PixabayImageResolver();

  protected rules = {
    hits: Joi.array().items(this.pixabayImageResolver.getRules()),
  };
}
