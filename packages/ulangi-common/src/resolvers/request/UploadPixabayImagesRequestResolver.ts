/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { UploadPixabayImagesRequest } from '../../interfaces/request/UploadPixabayImagesRequest';
import { PixabayImageResolver } from '../../resolvers/general/PixabayImageResolver';
import { RequestResolver } from './RequestResolver';

export class UploadPixabayImagesRequestResolver extends RequestResolver<
  UploadPixabayImagesRequest
> {
  private pixabayImageResolver = new PixabayImageResolver();

  protected rules = {
    query: Joi.strip(),
    body: {
      images: Joi.array().items(this.pixabayImageResolver.getRules()),
    },
  };
}
