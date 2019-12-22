/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { VocabularyWriting } from '../../interfaces/general/VocabularyWriting';

export class VocabularyWritingResolver extends AbstractResolver<
  VocabularyWriting
> {
  protected rules = {
    level: Joi.number(),
    disabled: Joi.boolean(),
    lastWrittenAt: Joi.date().allow(null),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
