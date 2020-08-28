/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { UserExtraDataName } from '../../enums/UserExtraDataName';
import { UserRating } from '../../interfaces/general/UserRating';

export class UserRatingResolver extends AbstractResolver<UserRating> {
  protected rules = {
    dataName: Joi.string().valid(UserExtraDataName.USER_RATING),
    dataValue: Joi.number().valid([1, 2, 3, 4, 5]),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
