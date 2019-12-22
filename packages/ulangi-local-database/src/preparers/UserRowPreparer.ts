/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { UserMembership, UserStatus } from '@ulangi/ulangi-common/enums';
import { User } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
  UserRow,
  UserRowForInsert,
  UserRowForUpdate,
} from '../interfaces/UserRow';

export class UserRowPreparer extends AbstractPreparer<UserRow> {
  protected insertRules = {
    userLocalId: Joi.forbidden()
      .strip()
      .optional(),
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

  protected updateRules = {
    userLocalId: Joi.forbidden()
      .strip()
      .optional(),
    userId: Joi.string(),
    email: Joi.string()
      .email()
      .optional(),
    userStatus: Joi.string()
      .valid(_.values(UserStatus))
      .optional(),
    membership: Joi.string()
      .valid(_.values(UserMembership))
      .optional(),
    membershipExpiredAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
    createdAt: Joi.number()
      .integer()
      .optional(),
    updatedAt: Joi.number()
      .integer()
      .optional(),
    firstSyncedAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
    lastSyncedAt: Joi.number()
      .integer()
      .allow(null)
      .optional(),
  };

  public prepareInsert(
    user: User,
    source: 'local' | 'remote'
  ): UserRowForInsert {
    if (source === 'local') {
      throw new Error('Cannot prepare insert user from local');
    }

    const userRow: UserRowForInsert = {
      userId: user.userId,
      email: user.email,
      userStatus: user.userStatus,
      membership: user.membership,
      membershipExpiredAt:
        user.membershipExpiredAt === null
          ? null
          : moment(user.membershipExpiredAt).unix(),
      createdAt: moment(user.createdAt).unix(),
      updatedAt: moment(user.updatedAt).unix(),
      firstSyncedAt:
        user.firstSyncedAt === null ? null : moment(user.firstSyncedAt).unix(),
      lastSyncedAt:
        user.lastSyncedAt === null ? null : moment(user.lastSyncedAt).unix(),
    };

    return this.validateData(userRow, this.insertRules) as UserRowForInsert;
  }

  public prepareUpdate(
    user: DeepPartial<User>,
    source: 'local' | 'remote'
  ): UserRowForUpdate {
    const userRow: UserRowForUpdate = {
      userLocalId: undefined,
      userId: user.userId,
      email: source === 'remote' ? user.email : undefined,
      userStatus: source === 'remote' ? user.userStatus : undefined,
      membership: source === 'remote' ? user.membership : undefined,
      membershipExpiredAt:
        source === 'remote'
          ? typeof user.membershipExpiredAt !== 'undefined' &&
            user.membershipExpiredAt !== null
            ? moment(user.membershipExpiredAt as Date).unix()
            : user.membershipExpiredAt
          : undefined,
      createdAt: undefined,
      updatedAt:
        source === 'remote'
          ? typeof user.updatedAt !== 'undefined'
            ? moment(user.updatedAt as Date).unix()
            : user.updatedAt
          : moment().unix(),
      firstSyncedAt:
        source === 'remote'
          ? typeof user.firstSyncedAt !== 'undefined' &&
            user.firstSyncedAt !== null
            ? moment(user.firstSyncedAt as Date).unix()
            : user.firstSyncedAt
          : undefined,
      lastSyncedAt:
        source === 'remote'
          ? typeof user.lastSyncedAt !== 'undefined' &&
            user.lastSyncedAt !== null
            ? moment(user.lastSyncedAt as Date).unix()
            : user.lastSyncedAt
          : undefined,
    };

    return _.omitBy(
      this.validateData(userRow, this.updateRules),
      _.isUndefined
    );
  }
}
