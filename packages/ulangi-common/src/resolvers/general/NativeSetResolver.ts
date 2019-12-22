/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { NativeSet } from '../../interfaces/general/NativeSet';
import { NativeVocabularyResolver } from './NativeVocabularyResolver';

export class NativeSetResolver extends AbstractResolver<NativeSet> {
  private nativeVocabularyResolver = new NativeVocabularyResolver();

  protected rules = {
    nativeSetId: Joi.string(),
    languageCodePair: Joi.string(),
    title: Joi.string(),
    subtitle: Joi.string()
      .optional()
      .allow(''),
    difficulty: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    vocabularyList: Joi.array().items(this.nativeVocabularyResolver.getRules()),
    author: Joi.string()
      .optional()
      .allow(''),
    link: Joi.string()
      .optional()
      .allow(''),
  };
}
