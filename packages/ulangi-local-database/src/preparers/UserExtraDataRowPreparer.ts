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
import * as moment from 'moment';

import { FieldState } from '../enums/FieldState';
import {
  UserExtraDataRow,
  UserExtraDataRowForUpsert,
} from '../interfaces/UserExtraDataRow';

export class UserExtraDataRowPreparer extends AbstractPreparer<
  UserExtraDataRow
> {
  protected upsertRules = {
    extraDataLocalId: Joi.forbidden()
      .strip()
      .optional(),
    userId: Joi.string(),
    dataName: Joi.string().valid(_.values(UserExtraDataName)),
    dataValue: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    firstSyncedAt: Joi.number().allow(null),
    lastSyncedAt: Joi.number().allow(null),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  public prepareUpsert(
    extraData: object,
    userId: string,
    source: 'local' | 'remote'
  ): UserExtraDataRowForUpsert;
  public prepareUpsert(
    extraData: UserExtraDataItem,
    userId: string,
    source: 'local' | 'remote'
  ): UserExtraDataRowForUpsert {
    const extraDataRow: UserExtraDataRowForUpsert = {
      userId: userId,
      dataName: extraData.dataName,
      dataValue: JSON.stringify(extraData.dataValue),
      createdAt:
        source === 'local'
          ? moment().unix()
          : moment(extraData.createdAt).unix(),
      updatedAt:
        source === 'local'
          ? moment().unix()
          : moment(extraData.updatedAt).unix(),
      firstSyncedAt:
        source === 'local'
          ? null
          : typeof extraData.firstSyncedAt !== 'undefined' &&
            extraData.firstSyncedAt !== null
          ? moment(extraData.firstSyncedAt).unix()
          : extraData.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? null
          : typeof extraData.lastSyncedAt !== 'undefined' &&
            extraData.lastSyncedAt !== null
          ? moment(extraData.lastSyncedAt).unix()
          : extraData.lastSyncedAt,
      fieldState:
        source === 'remote' ? FieldState.SYNCED : FieldState.TO_BE_SYNCED,
    };

    return this.validateData(
      extraDataRow,
      this.upsertRules
    ) as UserExtraDataRowForUpsert;
  }
}
