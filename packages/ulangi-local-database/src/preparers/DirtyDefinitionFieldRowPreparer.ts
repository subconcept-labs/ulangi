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
import { DirtyDefinitionFieldRow } from '../interfaces/DirtyDefinitionFieldRow';

export class DirtyDefinitionFieldRowPreparer extends AbstractPreparer<
  DirtyDefinitionFieldRow
> {
  protected insertRules = {
    definitionId: Joi.string(),
    fieldName: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  protected updateRules = {
    definitionId: Joi.string(),
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
    definitionId: string,
    fieldName: string,
    fieldState: FieldState
  ): DirtyDefinitionFieldRow {
    const fieldRow: {
      [P in keyof DirtyDefinitionFieldRow]: DirtyDefinitionFieldRow[P]
    } = {
      definitionId,
      fieldName,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      fieldState,
    };

    return this.validateData(
      fieldRow,
      this.insertRules
    ) as DirtyDefinitionFieldRow;
  }

  public prepareUpdate(
    data: DeepPartial<DirtyDefinitionFieldRow>
  ): DeepPartial<DirtyDefinitionFieldRow> {
    const row: {
      [P in keyof DirtyDefinitionFieldRow]:
        | undefined
        | DeepPartial<DirtyDefinitionFieldRow[P]>
    } = {
      definitionId: data.definitionId,
      fieldName: data.fieldName,
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
      fieldState: data.fieldState,
    };
    return _.omitBy(this.validateData(row, this.updateRules), _.isUndefined);
  }
}
