/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { PublicSet } from '../../interfaces/general/PublicSet';
import { PublicVocabularyResolver } from './PublicVocabularyResolver';

export class PublicSetResolver extends AbstractResolver<PublicSet> {
  private publicVocabularyResolver = new PublicVocabularyResolver();

  protected rules = {
    publicSetId: Joi.string(),
    title: Joi.string(),
    subtitle: Joi.string()
      .optional()
      .allow(''),
    difficulty: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    vocabularyList: Joi.array().items(this.publicVocabularyResolver.getRules()),
    authors: Joi.array().items({
      name: Joi.string(),
      link: Joi.string()
        .optional()
        .allow(''),
    }),
    isCurated: Joi.boolean().optional(),
  };
}
