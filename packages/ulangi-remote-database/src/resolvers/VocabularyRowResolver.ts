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
    vocabularyId: Joi.string(),
    userId: Joi.string(),
    setId: Joi.string(),
    vocabularyStatus: Joi.string().valid(_.values(VocabularyStatus)),
    vocabularyText: Joi.string(),
    level: Joi.number(),
    lastLearnedAt: Joi.date().allow(null),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
  };
}
