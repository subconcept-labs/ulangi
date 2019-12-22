/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { SetStatus } from '../../enums/SetStatus';
import { Set } from '../../interfaces/general/Set';
import { SetExtraDataItemResolver } from './SetExtraDataItemResolver';

export class SetResolver extends AbstractResolver<Set> {
  private setExtraDataItemResolver = new SetExtraDataItemResolver();

  protected rules = {
    setId: Joi.string(),
    setName: Joi.string(),
    learningLanguageCode: Joi.string(),
    translatedToLanguageCode: Joi.string(),
    setStatus: Joi.string().valid(_.values(SetStatus)),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    updatedStatusAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
    extraData: Joi.array().items(this.setExtraDataItemResolver.getRules()),
  };
}
