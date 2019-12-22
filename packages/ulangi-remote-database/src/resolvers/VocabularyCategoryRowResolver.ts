/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { VocabularyCategoryRow } from '../interfaces/VocabularyCategoryRow';

export class VocabularyCategoryRowResolver extends AbstractResolver<
  VocabularyCategoryRow
> {
  protected rules = {
    userId: Joi.string(),
    vocabularyId: Joi.string(),
    categoryName: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
  };
}
