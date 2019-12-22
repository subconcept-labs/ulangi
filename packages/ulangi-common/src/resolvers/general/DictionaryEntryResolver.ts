/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { DictionaryEntry } from '../../interfaces/general/DictionaryEntry';
import { DictionaryDefinitionResolver } from './DictionaryDefinitionResolver';

export class DictionaryEntryResolver extends AbstractResolver<DictionaryEntry> {
  private dictionaryDefinitionResolver = new DictionaryDefinitionResolver();

  protected rules = {
    vocabularyText: Joi.string(),
    definitions: Joi.array().items(
      Joi.object(this.dictionaryDefinitionResolver.getRules())
    ),
    categories: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string()),
  };
}
