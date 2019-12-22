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
    vocabularyWritingLocalId: Joi.number(),
    vocabularyId: Joi.string(),
    lastWrittenAt: Joi.number().allow(null),
    level: Joi.number(),
    disabled: Joi.number().valid([0, 1]),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    firstSyncedAt: Joi.number().allow(null),
    lastSyncedAt: Joi.number().allow(null),
  };
}
