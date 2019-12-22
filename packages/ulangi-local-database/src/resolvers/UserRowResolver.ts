/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import { UserMembership, UserStatus } from '@ulangi/ulangi-common/enums';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { UserRow } from '../interfaces/UserRow';

export class UserRowResolver extends AbstractResolver<UserRow> {
  protected rules = {
    userLocalId: Joi.number(),
    userId: Joi.string(),
    email: Joi.string().email(),
    userStatus: Joi.string().valid(_.values(UserStatus)),
    membership: Joi.string().valid(_.values(UserMembership)),
    membershipExpiredAt: Joi.number()
      .integer()
      .allow(null),
    createdAt: Joi.number().integer(),
    updatedAt: Joi.number().integer(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null),
  };
}
