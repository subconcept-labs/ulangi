/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { VocabularyRow } from '../interfaces/VocabularyRow';

export class VocabularyRowResolver extends AbstractResolver<VocabularyRow> {
  protected rules = {
    vocabularyLocalId: Joi.number(),
    vocabularyId: Joi.string(),
    setId: Joi.string(),
    vocabularyText: Joi.string(),
    vocabularyStatus: Joi.string().valid(_.values(VocabularyStatus)),
    lastLearnedAt: Joi.number()
      .integer()
      .allow(null),
    level: Joi.number(),
    createdAt: Joi.number().integer(),
    updatedAt: Joi.number().integer(),
    updatedStatusAt: Joi.number().integer(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null),
  };
}
