/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { User } from '@ulangi/ulangi-common/interfaces';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as moment from 'moment';

import { UserRow } from '../interfaces/UserRow';

export class UserRowConverter {
  public convertToUser(
    userRow: UserRow,
    extraData: readonly UserExtraDataItem[]
  ): User {
    return {
      userId: userRow.userId,
      email: userRow.email,
      userStatus: userRow.userStatus,
      membership: userRow.membership,
      membershipExpiredAt:
        userRow.membershipExpiredAt === null
          ? null
          : moment.unix(userRow.membershipExpiredAt).toDate(),
      createdAt: moment.unix(userRow.createdAt).toDate(),
      updatedAt: moment.unix(userRow.updatedAt).toDate(),
      firstSyncedAt:
        userRow.firstSyncedAt === null
          ? null
          : moment.unix(userRow.createdAt).toDate(),
      lastSyncedAt:
        userRow.lastSyncedAt === null
          ? null
          : moment.unix(userRow.updatedAt).toDate(),
      extraData,
    };
  }

  public convertToPartialUser(
    userRow: DeepPartial<UserRow>,
    extraData: undefined | readonly DeepPartial<UserExtraDataItem>[]
  ): DeepPartial<User> {
    return _.omitBy(
      {
        userId: userRow.userId,
        email: userRow.email,
        userStatus: userRow.userStatus,
        membership: userRow.membership,
        membershipExpiredAt:
          typeof userRow.membershipExpiredAt !== 'undefined' &&
          userRow.membershipExpiredAt !== null
            ? moment.unix(userRow.membershipExpiredAt).toDate()
            : userRow.membershipExpiredAt,
        createdAt:
          typeof userRow.createdAt !== 'undefined'
            ? moment.unix(userRow.createdAt).toDate()
            : userRow.createdAt,
        updatedAt:
          typeof userRow.updatedAt !== 'undefined'
            ? moment.unix(userRow.updatedAt).toDate()
            : userRow.updatedAt,
        firstSyncedAt:
          typeof userRow.firstSyncedAt !== 'undefined' &&
          userRow.firstSyncedAt !== null
            ? moment.unix(userRow.firstSyncedAt).toDate()
            : userRow.firstSyncedAt,
        lastSyncedAt:
          typeof userRow.lastSyncedAt !== 'undefined' &&
          userRow.lastSyncedAt !== null
            ? moment.unix(userRow.lastSyncedAt).toDate()
            : userRow.lastSyncedAt,
        extraData,
      },
      _.isUndefined
    );
  }
}
