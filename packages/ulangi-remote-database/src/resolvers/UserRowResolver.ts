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
    userId: Joi.string(),
    shardId: Joi.number(),
    email: Joi.string(),
    password: Joi.string(),
    accessKey: Joi.string(),
    userStatus: Joi.string().valid(_.values(UserStatus)),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date(),
    lastSyncedAt: Joi.date(),
    membership: Joi.string().valid(_.values(UserMembership)),
    membershipExpiredAt: Joi.date().allow(null),
  };
}
