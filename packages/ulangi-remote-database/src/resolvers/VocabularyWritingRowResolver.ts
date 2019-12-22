/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { VocabularyWritingRow } from '../interfaces/VocabularyWritingRow';

export class VocabularyWritingRowResolver extends AbstractResolver<
  VocabularyWritingRow
> {
  protected rules = {
    userId: Joi.string(),
    vocabularyId: Joi.string(),
    level: Joi.number(),
    lastWrittenAt: Joi.date().allow(null),
    disabled: Joi.number().valid([0, 1]),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
  };
}
