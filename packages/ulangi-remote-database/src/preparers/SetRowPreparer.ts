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

import { SetRow, SetRowForInsert, SetRowForUpdate } from '../interfaces/SetRow';

export class SetRowPreparer extends AbstractPreparer<SetRow> {
  protected insertRules = {
    userId: Joi.string(),
    setId: Joi.string(),
    setName: Joi.string(),
    learningLanguageCode: Joi.string(),
    translatedToLanguageCode: Joi.string(),
    setStatus: Joi.string().valid(_.values(SetStatus)),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  protected updateRules = {
    userId: Joi.string(),
    setId: Joi.string(),
    setName: Joi.string().optional(),
    learningLanguageCode: Joi.string().optional(),
    translatedToLanguageCode: Joi.string().optional(),
    setStatus: Joi.string()
      .valid(_.values(SetStatus))
      .optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    updatedStatusAt: Joi.date().optional(),
    firstSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
    lastSyncedAt: Joi.forbidden()
      .strip()
      .optional(),
  };

  // Set can any object as long as it satisfies the rules
  public prepareInsert(userId: string, set: object): SetRowForInsert;
  public prepareInsert(userId: string, set: Set): SetRowForInsert {
    const setRow = this.convertToInsertRow(userId, set);

    return this.validateData(setRow, this.insertRules) as SetRowForInsert;
  }

  public canPrepareInsert(userId: string, set: object): boolean;
  public canPrepareInsert(userId: string, set: Set): boolean {
    const setRow = this.convertToInsertRow(userId, set);

    return this.isValidData(setRow, this.insertRules);
  }

  public prepareUpdate(userId: string, set: DeepPartial<Set>): SetRowForUpdate {
    const setRow = this.convertToUpdateRow(userId, set);
    return _.omitBy(this.validateData(setRow, this.updateRules), _.isUndefined);
  }

  public canPrepareUpdate(userId: string, set: DeepPartial<Set>): boolean {
    const setRow = this.convertToUpdateRow(userId, set);
    return this.isValidData(setRow, this.updateRules);
  }

  private convertToInsertRow(userId: string, set: Set): SetRowForUpdate {
    const setRow: SetRowForInsert = {
      userId,
      setId: set.setId,
      setName: set.setName,
      setStatus: set.setStatus,
      learningLanguageCode: set.learningLanguageCode,
      translatedToLanguageCode: set.translatedToLanguageCode,
      createdAt: set.createdAt,
      updatedAt: set.updatedAt,
      updatedStatusAt: set.updatedStatusAt,
    };

    return setRow;
  }

  private convertToUpdateRow(
    userId: string,
    set: DeepPartial<Set>
  ): SetRowForUpdate {
    const setRow: {
      [P in keyof SetRow]: undefined | DeepPartial<SetRow[P]>
    } = {
      userId,
      setId: set.setId,
      setName: set.setName,
      setStatus: set.setStatus,
      learningLanguageCode: set.learningLanguageCode,
      translatedToLanguageCode: set.translatedToLanguageCode,
      createdAt: set.createdAt,
      updatedAt: set.updatedAt,
      updatedStatusAt: set.updatedStatusAt,
      firstSyncedAt: undefined,
      lastSyncedAt: undefined,
    };
    return setRow;
  }
}
