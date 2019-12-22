/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as moment from 'moment';

import { IncompatibleSetRow } from '../interfaces/IncompatibleSetRow';

export class IncompatibleSetRowPreparer extends AbstractPreparer<
  IncompatibleSetRow
> {
  protected insertRules = {
    setId: Joi.string(),
    lastTriedCommonVersion: Joi.string(),
    lastTriedAt: Joi.number().integer(),
  };

  protected updateRules = {
    setId: Joi.string(),
    lastTriedCommonVersion: Joi.string(),
    lastTriedAt: Joi.number().integer(),
  };

  public prepareInsert(
    setId: string,
    lastTriedCommonVersion: string
  ): IncompatibleSetRow {
    const incompatibleSetRow: IncompatibleSetRow = {
      setId,
      lastTriedCommonVersion,
      lastTriedAt: moment().unix(),
    };

    return this.validateData(
      incompatibleSetRow,
      this.insertRules
    ) as IncompatibleSetRow;
  }

  public prepareUpdate(
    setId: string,
    lastTriedCommonVersion: string
  ): DeepPartial<IncompatibleSetRow> {
    const incompatibleSetRow: IncompatibleSetRow = {
      setId,
      lastTriedCommonVersion,
      lastTriedAt: moment().unix(),
    };
    return this.validateData(incompatibleSetRow, this.updateRules);
  }

  public prepareUpsert(
    setId: string,
    lastTriedCommonVersion: string
  ): IncompatibleSetRow {
    return this.prepareInsert(setId, lastTriedCommonVersion);
  }
}
