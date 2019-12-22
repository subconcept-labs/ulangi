/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { AutoShowInAppRating } from '../../interfaces/general/AutoShowInAppRating';

export class AutoShowInAppRatingResolver extends AbstractResolver<
  AutoShowInAppRating
> {
  protected rules = {
    dataName: Joi.string().valid(UserExtraDataName.AUTO_SHOW_IN_APP_RATING),
    dataValue: Joi.boolean(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
