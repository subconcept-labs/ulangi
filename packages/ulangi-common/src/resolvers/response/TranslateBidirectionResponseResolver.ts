/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { TranslateBidirectionResponse } from '../../interfaces/response/TranslateBidirectionResponse';
import { TranslationWithLanguagesResolver } from '../general/TranslationWithLanguagesResolver';

export class TranslateBidirectionResponseResolver extends AbstractResolver<
  TranslateBidirectionResponse
> {
  private translationWithLanguagesResolver = new TranslationWithLanguagesResolver();

  protected rules = {
    translations: Joi.array().items(
      this.translationWithLanguagesResolver.getRules()
    ),
  };
}
