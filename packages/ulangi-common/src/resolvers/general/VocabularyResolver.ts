/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { VocabularyStatus } from '../../enums/VocabularyStatus';
import { Vocabulary } from '../../interfaces/general/Vocabulary';
import { DefinitionResolver } from './DefinitionResolver';
import { VocabularyCategoryResolver } from './VocabularyCategoryResolver';
import { VocabularyWritingResolver } from './VocabularyWritingResolver';

export class VocabularyResolver extends AbstractResolver<Vocabulary> {
  private definitionResolver = new DefinitionResolver();
  private vocabularyCategoryResolver = new VocabularyCategoryResolver();
  private vocabularyWritingResolver = new VocabularyWritingResolver();

  protected rules = {
    vocabularyId: Joi.string(),
    vocabularyText: Joi.string(),
    vocabularyStatus: Joi.string().valid(_.values(VocabularyStatus)),
    definitions: Joi.array().items(this.definitionResolver.getRules()),
    level: Joi.number(),
    lastLearnedAt: Joi.date().allow(null),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
    extraData: Joi.array(),
    category: Joi.object(this.vocabularyCategoryResolver.getRules()).optional(),
    writing: Joi.object(this.vocabularyWritingResolver.getRules()).optional(),
  };
}
