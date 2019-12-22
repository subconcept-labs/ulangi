/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { SetExtraDataRow } from '../interfaces/SetExtraDataRow';

export class SetExtraDataRowResolver extends AbstractResolver<SetExtraDataRow> {
  protected rules = {
    userId: Joi.string(),
    setId: Joi.string(),
    dataName: Joi.string().valid(_.values(SetExtraDataName)),
    dataValue: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
  };
}
