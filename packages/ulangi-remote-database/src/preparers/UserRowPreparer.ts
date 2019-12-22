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

import {
  UserRow,
  UserRowForInsert,
  UserRowForUpdate,
} from '../interfaces/UserRow';

export class UserRowPreparer extends AbstractPreparer<UserRow> {
  protected insertRules: { [P in keyof UserRow]: Joi.SchemaLike };
  protected updateRules: { [P in keyof UserRow]: Joi.SchemaLike };

  public constructor() {
    super();

    this.insertRules = {
      userId: Joi.string(),
      shardId: Joi.number(),
      email: Joi.string().email(),
      password: Joi.string(),
      accessKey: Joi.string(),
      userStatus: Joi.string().valid(_.values(UserStatus)),
      membership: Joi.string().valid(_.values(UserMembership)),
      membershipExpiredAt: Joi.date().allow(null),
      createdAt: Joi.forbidden()
        .strip()
        .optional(),
      updatedAt: Joi.forbidden()
        .strip()
        .optional(),
      firstSyncedAt: Joi.forbidden()
        .strip()
        .optional(),
      lastSyncedAt: Joi.forbidden()
        .strip()
        .optional(),
    };

    this.updateRules = {
      userId: Joi.string(),
      shardId: Joi.forbidden()
        .strip()
        .optional(),
      email: Joi.string()
        .email()
        .optional(),
      password: Joi.string().optional(),
      accessKey: Joi.string().optional(),
      userStatus: Joi.string()
        .valid(_.values(UserStatus))
        .optional(),
      membership: Joi.string()
        .valid(_.values(UserMembership))
        .optional(),
      membershipExpiredAt: Joi.date()
        .allow(null)
        .optional(),
      createdAt: Joi.date().optional(),
      updatedAt: Joi.date().optional(),
      firstSyncedAt: Joi.forbidden()
        .strip()
        .optional(),
      lastSyncedAt: Joi.forbidden()
        .strip()
        .optional(),
    };
  }

  public prepareInsert(
    user: User,
    shardId: number,
    password: string,
    accessKey: string
  ): UserRowForInsert {
    const userRow: UserRowForInsert = {
      userId: user.userId,
      shardId,
      password,
      accessKey,
      email: user.email,
      userStatus: user.userStatus,
      membership: user.membership,
      membershipExpiredAt: user.membershipExpiredAt,
    };

    return this.validateData(userRow, this.insertRules) as UserRowForInsert;
  }

  public prepareUpdate(
    user: DeepPartial<User>,
    newPassword: undefined | string,
    newAccessKey: undefined | string
  ): UserRowForUpdate {
    const userRow: {
      [P in keyof UserRowForUpdate]:
        | undefined
        | DeepPartial<UserRowForUpdate[P]>
    } = {
      userId: user.userId,
      shardId: undefined,
      email: user.email,
      password: newPassword,
      accessKey: newAccessKey,
      userStatus: user.userStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstSyncedAt: undefined,
      lastSyncedAt: undefined,
      membership: user.membership,
      membershipExpiredAt: user.membershipExpiredAt,
    };

    return _.omitBy(
      this.validateData(userRow, this.updateRules),
      _.isUndefined
    );
  }
}
