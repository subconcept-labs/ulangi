/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';

import {
  VocabularyLocalDataRow,
  VocabularyLocalDataRowForUpsert,
} from '../interfaces/VocabularyLocalDataRow';

export class VocabularyLocalDataRowPreparer extends AbstractPreparer<
  VocabularyLocalDataRow
> {
  protected upsertRules = {
    vocabularyLocalDataId: Joi.forbidden()
      .strip()
      .optional(),
    vocabularyId: Joi.string(),
    vocabularyTerm: Joi.string()
      .allow(null)
      .allow('')
      .optional(),
  };

  public prepareUpsert(
    vocabularyLocalData: object,
    vocabularyId: string
  ): VocabularyLocalDataRowForUpsert;
  public prepareUpsert(
    vocabularyLocalData: VocabularyLocalDataRow,
    vocabularyId: string
  ): VocabularyLocalDataRowForUpsert {
    const vocabularyLocalDataRow: VocabularyLocalDataRowForUpsert = {
      vocabularyId,
      vocabularyTerm: vocabularyLocalData.vocabularyTerm,
    };

    return _.omitBy(
      this.validateData(vocabularyLocalDataRow, this.upsertRules),
      _.isUndefined
    );
  }
}
