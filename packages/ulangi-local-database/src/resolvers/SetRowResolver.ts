/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { SetStatus } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { SetRow } from '../interfaces/SetRow';

export class SetRowResolver extends AbstractResolver<SetRow> {
  protected rules = {
    setLocalId: Joi.number(),
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
}
