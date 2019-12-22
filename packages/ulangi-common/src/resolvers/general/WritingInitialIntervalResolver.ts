/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SetExtraDataName } from '../../enums/SetExtraDataName';
import { WritingInitialInterval } from '../../interfaces/general/WritingInitialInterval';

export class WritingInitialIntervalResolver extends AbstractResolver<
  WritingInitialInterval
> {
  protected rules = {
    dataName: Joi.string().valid(SetExtraDataName.WRITING_INITIAL_INTERVAL),
    dataValue: Joi.number(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
