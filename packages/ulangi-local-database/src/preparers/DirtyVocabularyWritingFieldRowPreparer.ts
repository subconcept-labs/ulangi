/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import { FieldState } from '../enums/FieldState';
import { DirtyVocabularyWritingFieldRow } from '../interfaces/DirtyVocabularyWritingFieldRow';

export class DirtyVocabularyWritingFieldRowPreparer extends AbstractPreparer<
  DirtyVocabularyWritingFieldRow
> {
  protected insertRules = {
    vocabularyId: Joi.string(),
    fieldName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  protected updateRules = {
    vocabularyId: Joi.string(),
    fieldName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number().optional(),
    fieldState: Joi.string()
      .valid(_.values(FieldState))
      .optional(),
  };

  public prepareInsert(
    vocabularyId: string,
    fieldName: string,
    fieldState: FieldState
  ): DirtyVocabularyWritingFieldRow {
    const fieldRow: {
      [P in keyof DirtyVocabularyWritingFieldRow]: DirtyVocabularyWritingFieldRow[P]
    } = {
      vocabularyId,
      fieldName,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      fieldState,
    };

    return (this.validateData(
      fieldRow,
      this.insertRules
    ) as DirtyVocabularyWritingFieldRow) as DirtyVocabularyWritingFieldRow;
  }

  public prepareUpdate(
    data: DeepPartial<DirtyVocabularyWritingFieldRow>
  ): DeepPartial<DirtyVocabularyWritingFieldRow> {
    const row: {
      [P in keyof DirtyVocabularyWritingFieldRow]:
        | undefined
        | DeepPartial<DirtyVocabularyWritingFieldRow[P]>
    } = {
      vocabularyId: data.vocabularyId,
      fieldName: data.fieldName,
      createdAt: undefined,
      updatedAt: moment().unix(),
      fieldState: data.fieldState,
    };

    return _.omitBy(this.validateData(row, this.updateRules), _.isUndefined);
  }
}
