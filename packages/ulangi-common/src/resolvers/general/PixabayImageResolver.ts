/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { PixabayImage } from '../../interfaces/general/PixabayImage';

export class PixabayImageResolver extends AbstractResolver<PixabayImage> {
  protected rules = {
    id: Joi.number(),
    previewURL: Joi.string(),
    previewWidth: Joi.number(),
    previewHeight: Joi.number(),
    webformatURL: Joi.string(),
    webformatWidth: Joi.number(),
    webformatHeight: Joi.number(),
    largeImageURL: Joi.string(),
  };
}
