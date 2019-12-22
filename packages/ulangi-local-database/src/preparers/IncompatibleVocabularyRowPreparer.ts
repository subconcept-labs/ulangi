/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as moment from 'moment';

import { IncompatibleVocabularyRow } from '../interfaces/IncompatibleVocabularyRow';

export class IncompatibleVocabularyRowPreparer extends AbstractPreparer<
  IncompatibleVocabularyRow
> {
  protected insertRules = {
    vocabularyId: Joi.string(),
    lastTriedCommonVersion: Joi.string(),
    lastTriedAt: Joi.number().integer(),
  };

  protected updateRules = {
    vocabularyId: Joi.string(),
    lastTriedCommonVersion: Joi.string(),
    lastTriedAt: Joi.number().integer(),
  };

  public prepareInsert(
    vocabularyId: string,
    lastTriedCommonVersion: string
  ): IncompatibleVocabularyRow {
    const incompatibleVocabularyRow: IncompatibleVocabularyRow = {
      vocabularyId,
      lastTriedCommonVersion,
      lastTriedAt: moment().unix(),
    };

    return this.validateData(
      incompatibleVocabularyRow,
      this.insertRules
    ) as IncompatibleVocabularyRow;
  }

  public prepareUpdate(
    vocabularyId: string,
    lastTriedCommonVersion: string
  ): DeepPartial<IncompatibleVocabularyRow> {
    const incompatibleVocabularyRow: IncompatibleVocabularyRow = {
      vocabularyId,
      lastTriedCommonVersion,
      lastTriedAt: moment().unix(),
    };
    return this.validateData(incompatibleVocabularyRow, this.updateRules);
  }

  public prepareUpsert(
    vocabularyId: string,
    lastTriedCommonVersion: string
  ): IncompatibleVocabularyRow {
    return this.prepareInsert(vocabularyId, lastTriedCommonVersion);
  }
}
