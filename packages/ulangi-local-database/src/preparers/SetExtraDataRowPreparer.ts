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
import * as moment from 'moment';

import { FieldState } from '../enums/FieldState';
import {
  SetExtraDataRow,
  SetExtraDataRowForUpsert,
} from '../interfaces/SetExtraDataRow';

export class SetExtraDataRowPreparer extends AbstractPreparer<SetExtraDataRow> {
  protected upsertRules = {
    extraDataLocalId: Joi.forbidden()
      .strip()
      .optional(),
    setId: Joi.string(),
    dataName: Joi.string().valid(_.values(SetExtraDataName)),
    dataValue: Joi.string(),
    createdAt: Joi.number(),
    updatedAt: Joi.number(),
    firstSyncedAt: Joi.number().allow(null),
    lastSyncedAt: Joi.number().allow(null),
    fieldState: Joi.string().valid(_.values(FieldState)),
  };

  public prepareUpsert(
    extraData: object,
    setId: string,
    source: 'local' | 'remote'
  ): SetExtraDataRowForUpsert;
  public prepareUpsert(
    extraData: SetExtraDataItem,
    setId: string,
    source: 'local' | 'remote'
  ): SetExtraDataRowForUpsert {
    const extraDataRow: SetExtraDataRowForUpsert = {
      setId,
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
    ) as SetExtraDataRowForUpsert;
  }
}
