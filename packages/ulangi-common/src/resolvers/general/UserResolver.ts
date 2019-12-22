/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { UserMembership } from '../../enums/UserMembership';
import { UserStatus } from '../../enums/UserStatus';
import { User } from '../../interfaces/general/User';
import { UserExtraDataItemResolver } from './UserExtraDataItemResolver';

export class UserResolver extends AbstractResolver<User> {
  protected userExtraDataItemResolver = new UserExtraDataItemResolver();

  protected rules = {
    userId: Joi.string(),
    email: Joi.string().email(),
    membership: Joi.string().valid(_.values(UserMembership)),
    membershipExpiredAt: Joi.date().allow(null),
    userStatus: Joi.string().valid(_.values(UserStatus)),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
    extraData: Joi.array().items(this.userExtraDataItemResolver.getRules()),
  };
}
