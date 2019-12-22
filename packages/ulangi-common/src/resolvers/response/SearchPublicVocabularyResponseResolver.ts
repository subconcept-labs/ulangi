/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SearchPublicVocabularyResponse } from '../../interfaces/response/SearchPublicVocabularyResponse';
import { PublicVocabularyResolver } from '../general/PublicVocabularyResolver';

export class SearchPublicVocabularyResponseResolver extends AbstractResolver<
  SearchPublicVocabularyResponse
> {
  private publicVocabularyResolver = new PublicVocabularyResolver();

  protected rules = {
    vocabularyList: Joi.array().items(this.publicVocabularyResolver.getRules()),
    nextOffset: Joi.number().allow(null),
  };
}
