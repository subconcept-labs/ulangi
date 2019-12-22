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
import { DirtySetFieldRow } from '../interfaces/DirtySetFieldRow';

export class DirtySetFieldRowPreparer extends AbstractPreparer<
  DirtySetFieldRow
> {
  protected insertRules = {
    setId: Joi.string(),
    fieldName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  protected updateRules = {
    setId: Joi.string(),
    fieldName: Joi.string(),
    createdAt: Joi.forbidden()
      .strip()
      .optional(),
    updatedAt: Joi.number().optional(),
    fieldState: Joi.string()
      .valid(_.values(FieldState))
      .optional(),
  };

  public prepareInsert(
    setId: string,
    fieldName: string,
    fieldState: FieldState
  ): DirtySetFieldRow {
    const fieldRow: { [P in keyof DirtySetFieldRow]: DirtySetFieldRow[P] } = {
      setId,
      fieldName,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      fieldState,
    };

    return this.validateData(fieldRow, this.insertRules) as DirtySetFieldRow;
  }

  public prepareUpdate(
    data: DeepPartial<DirtySetFieldRow>
  ): DeepPartial<DirtySetFieldRow> {
    const row: {
      [P in keyof DirtySetFieldRow]:
        | undefined
        | DeepPartial<DirtySetFieldRow[P]>
    } = {
      setId: data.setId,
      fieldName: data.fieldName,
      createdAt: undefined,
      updatedAt: moment().unix(),
      fieldState: data.fieldState,
    };

    return _.omitBy(this.validateData(row, this.updateRules), _.isUndefined);
  }
}
