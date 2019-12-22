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
import { DirtyUserFieldRow } from '../interfaces/DirtyUserFieldRow';

export class DirtyUserFieldRowPreparer extends AbstractPreparer<
  DirtyUserFieldRow
> {
  protected insertRules = {
    userId: Joi.string(),
    fieldName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  protected updateRules = {
    userId: Joi.string(),
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
    userId: string,
    fieldName: string,
    fieldState: FieldState
  ): DirtyUserFieldRow {
    const fieldRow: { [P in keyof DirtyUserFieldRow]: DirtyUserFieldRow[P] } = {
      userId,
      fieldName,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      fieldState,
    };

    return this.validateData(fieldRow, this.insertRules) as DirtyUserFieldRow;
  }

  public prepareUpdate(
    data: DeepPartial<DirtyUserFieldRow>
  ): DeepPartial<DirtyUserFieldRow> {
    const row: {
      [P in keyof DirtyUserFieldRow]:
        | undefined
        | DeepPartial<DirtyUserFieldRow[P]>
    } = {
      userId: data.userId,
      fieldName: data.fieldName,
      createdAt: undefined,
      updatedAt: moment().unix(),
      fieldState: data.fieldState,
    };

    return _.omitBy(this.validateData(row, this.updateRules), _.isUndefined);
  }
}
