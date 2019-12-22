/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { PublicVocabulary } from '../../interfaces/general/PublicVocabulary';
import { PublicDefinitionResolver } from '../../resolvers/general/PublicDefinitionResolver';

export class PublicVocabularyResolver extends AbstractResolver<
  PublicVocabulary
> {
  private discoveredDefinitionResolver = new PublicDefinitionResolver();

  protected rules = {
    publicVocabularyId: Joi.string(),
    vocabularyText: Joi.string(),
    definitions: Joi.array().items(
      this.discoveredDefinitionResolver.getRules()
    ),
    categories: Joi.array().items(Joi.string()),
  };
}
