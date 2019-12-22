/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { FieldState } from '../enums/FieldState';
import { VocabularyCategoryRow } from '../interfaces/VocabularyCategoryRow';

export class VocabularyCategoryRowResolver extends AbstractResolver<
  VocabularyCategoryRow
> {
  protected rules = {
    vocabularyCategoryLocalId: Joi.number(),
    vocabularyId: Joi.string(),
    categoryName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    firstSyncedAt: Joi.number().allow(null),
    lastSyncedAt: Joi.number().allow(null),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };
}
