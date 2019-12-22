/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { UserExtraDataRow } from '../interfaces/UserExtraDataRow';

export class UserExtraDataRowResolver extends AbstractResolver<
  UserExtraDataRow
> {
  protected rules = {
    userId: Joi.string(),
    dataName: Joi.string().valid(_.values(UserExtraDataName)),
    dataValue: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
  };
}
