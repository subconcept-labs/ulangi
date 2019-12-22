/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { NativeVocabulary } from '../../interfaces/general/NativeVocabulary';
import { NativeDefinitionResolver } from '../../resolvers/general/NativeDefinitionResolver';

export class NativeVocabularyResolver extends AbstractResolver<
  NativeVocabulary
> {
  private nativeDefinitionResolver = new NativeDefinitionResolver();

  protected rules = {
    nativeVocabularyId: Joi.string(),
    vocabularyText: Joi.string(),
    order: Joi.number(),
    definitions: Joi.array().items(this.nativeDefinitionResolver.getRules()),
  };
}
