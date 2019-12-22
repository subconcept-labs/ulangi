/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { IncompatibleVocabularyRow } from '../interfaces/IncompatibleVocabularyRow';

export class IncompatibleVocabularyRowResolver extends AbstractResolver<
  IncompatibleVocabularyRow
> {
  protected rules = {
    vocabularyId: Joi.string(),
    lastTriedCommonVersion: Joi.string(),
    lastTriedAt: Joi.number().integer(),
  };
}
