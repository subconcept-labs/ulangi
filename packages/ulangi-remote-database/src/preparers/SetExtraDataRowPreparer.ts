/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as Joi from 'joi';
import * as _ from 'lodash';

import {
  SetExtraDataRow,
  SetExtraDataRowForUpsert,
} from '../interfaces/SetExtraDataRow';

export class SetExtraDataRowPreparer extends AbstractPreparer<SetExtraDataRow> {
  protected upsertRules = {
    userId: Joi.string(),
    setId: Joi.string(),
    dataName: Joi.string().valid(_.values(SetExtraDataName)),
    dataValue: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  public prepareUpsert(
    userId: string,
    data: object,
    setId: string
  ): SetExtraDataRowForUpsert;
  public prepareUpsert(
    userId: string,
    data: SetExtraDataItem,
    setId: string
  ): SetExtraDataRowForUpsert {
    const row = this.convertToUpsertRow(userId, data, setId);

    return this.validateData(row, this.upsertRules) as SetExtraDataRowForUpsert;
  }

  public canPrepareUpsert(userId: string, data: object, setId: string): boolean;
  public canPrepareUpsert(
    userId: string,
    data: SetExtraDataItem,
    setId: string
  ): boolean {
    const row = this.convertToUpsertRow(userId, data, setId);

    return this.isValidData(row, this.upsertRules);
  }

  private convertToUpsertRow(
    userId: string,
    data: SetExtraDataItem,
    setId: string
  ): SetExtraDataRowForUpsert {
    const row: SetExtraDataRowForUpsert = {
      userId,
      setId,
      dataName: data.dataName,
      dataValue: JSON.stringify(data.dataValue),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    return row;
  }
}
