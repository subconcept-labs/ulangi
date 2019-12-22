/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { TranslateResponse } from '../../interfaces/response/TranslateResponse';
import { TranslationResolver } from '../general/TranslationResolver';

export class TranslateResponseResolver extends AbstractResolver<
  TranslateResponse
> {
  private translationResolver = new TranslationResolver();

  protected rules = {
    translations: Joi.array().items(this.translationResolver.getRules()),
  };
}
