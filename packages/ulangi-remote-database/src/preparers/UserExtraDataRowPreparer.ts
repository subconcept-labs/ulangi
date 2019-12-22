/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as Joi from 'joi';
import * as _ from 'lodash';

import {
  UserExtraDataRow,
  UserExtraDataRowForUpsert,
} from '../interfaces/UserExtraDataRow';

export class UserExtraDataRowPreparer extends AbstractPreparer<
  UserExtraDataRow
> {
  protected upsertRules = {
    userId: Joi.string(),
    dataName: Joi.string().valid(_.values(UserExtraDataName)),
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
    extraDataItem: object
  ): UserExtraDataRowForUpsert;
  public prepareUpsert(
    userId: string,
    extraDataItem: UserExtraDataItem
  ): UserExtraDataRowForUpsert {
    const row = this.convertToUpsertRow(userId, extraDataItem);

    return this.validateData(
      row,
      this.upsertRules
    ) as UserExtraDataRowForUpsert;
  }

  public canPrepareUpsert(userId: string, extraDataItem: object): boolean;
  public canPrepareUpsert(
    userId: string,
    extraDataItem: UserExtraDataItem
  ): boolean {
    const row = this.convertToUpsertRow(userId, extraDataItem);

    return this.isValidData(row, this.upsertRules);
  }

  private convertToUpsertRow(
    userId: string,
    extraDataItem: UserExtraDataItem
  ): UserExtraDataRowForUpsert {
    const row: UserExtraDataRowForUpsert = {
      userId,
      dataName: extraDataItem.dataName,
      dataValue: JSON.stringify(extraDataItem.dataValue),
      createdAt: extraDataItem.createdAt,
      updatedAt: extraDataItem.updatedAt,
    };
    return row;
  }
}
