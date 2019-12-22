/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SetStatus } from '@ulangi/ulangi-common/enums';
import { Set } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SetRow, SetRowForInsert, SetRowForUpdate } from '../interfaces/SetRow';

export class SetRowPreparer extends AbstractPreparer<SetRow> {
  protected insertRules = {
    setLocalId: Joi.forbidden()
      .strip()
      .optional(),
    setId: Joi.string(),
    setName: Joi.string(),
    learningLanguageCode: Joi.string(),
    translatedToLanguageCode: Joi.string(),
    setStatus: Joi.string().valid(_.values(SetStatus)),
    createdAt: Joi.number().integer(),
    updatedAt: Joi.number().integer(),
    updatedStatusAt: Joi.number().integer(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null),
  };

  protected updateRules = {
    setLocalId: Joi.forbidden()
      .strip()
      .optional(),
    setId: Joi.string(),
    setName: Joi.string().optional(),
    learningLanguageCode: Joi.string().optional(),
    translatedToLanguageCode: Joi.string().optional(),
    setStatus: Joi.string()
      .valid(_.values(SetStatus))
      .optional(),
    createdAt: Joi.forbidden()
      .strip()
      .optional(),
    updatedAt: Joi.number()
      .integer()
      .optional(),
    updatedStatusAt: Joi.number()
      .integer()
      .optional(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
  };

  public prepareInsert(
    set: object,
    source: 'local' | 'remote'
  ): SetRowForInsert;
  public prepareInsert(set: Set, source: 'local' | 'remote'): SetRowForInsert {
    const setRow: SetRowForInsert = {
      setId: set.setId,
      setName: set.setName,
      learningLanguageCode: set.learningLanguageCode,
      translatedToLanguageCode: set.translatedToLanguageCode,
      setStatus: set.setStatus,
      createdAt:
        source === 'local' ? moment().unix() : moment(set.createdAt).unix(),
      updatedAt:
        source === 'local' ? moment().unix() : moment(set.updatedAt).unix(),
      updatedStatusAt:
        source === 'local'
          ? moment().unix()
          : moment(set.updatedStatusAt).unix(),
      firstSyncedAt:
        source === 'local'
          ? null
          : typeof set.firstSyncedAt !== 'undefined' &&
            set.firstSyncedAt !== null
          ? moment(set.firstSyncedAt).unix()
          : set.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? null
          : typeof set.lastSyncedAt !== 'undefined' && set.lastSyncedAt !== null
          ? moment(set.lastSyncedAt).unix()
          : set.lastSyncedAt,
    };

    return this.validateData(setRow, this.insertRules) as SetRowForInsert;
  }

  public prepareUpdate(
    set: DeepPartial<Set>,
    source: 'local' | 'remote'
  ): SetRowForUpdate {
    const setRow: SetRowForUpdate = {
      setLocalId: undefined,
      setId: set.setId,
      setName: set.setName,
      learningLanguageCode: set.learningLanguageCode,
      translatedToLanguageCode: set.translatedToLanguageCode,
      setStatus: set.setStatus,
      createdAt: undefined,
      updatedAt:
        source === 'local'
          ? moment().unix()
          : typeof set.updatedAt !== 'undefined' && set.updatedAt !== null
          ? moment(set.updatedAt as Date).unix()
          : set.updatedAt,
      // If user updates setStatus, then set updatedStatusAt
      updatedStatusAt:
        source === 'local' && typeof set.setStatus !== 'undefined'
          ? moment().unix()
          : typeof set.updatedStatusAt !== 'undefined' &&
            set.updatedStatusAt !== null
          ? moment(set.updatedStatusAt as Date).unix()
          : set.updatedStatusAt,
      // User can't update these values locally
      firstSyncedAt:
        source === 'local'
          ? undefined
          : typeof set.firstSyncedAt !== 'undefined' &&
            set.firstSyncedAt !== null
          ? moment(set.firstSyncedAt as Date).unix()
          : set.firstSyncedAt,
      lastSyncedAt:
        source === 'local'
          ? undefined
          : typeof set.lastSyncedAt !== 'undefined' && set.lastSyncedAt !== null
          ? moment(set.lastSyncedAt as Date).unix()
          : set.lastSyncedAt,
    };

    return _.omitBy(this.validateData(setRow, this.updateRules), _.isUndefined);
  }
}
