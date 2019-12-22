/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { User } from '@ulangi/ulangi-common/interfaces';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';

import { UserRow } from '../interfaces/UserRow';

export class UserRowConverter {
  public convertToUser(
    userRow: UserRow,
    extraData: readonly UserExtraDataItem[]
  ): User {
    const user: User = {
      userId: userRow.userId,
      email: userRow.email,
      userStatus: userRow.userStatus,
      membership: userRow.membership,
      membershipExpiredAt: userRow.membershipExpiredAt,
      createdAt: userRow.createdAt,
      updatedAt: userRow.updatedAt,
      firstSyncedAt: userRow.firstSyncedAt,
      lastSyncedAt: userRow.lastSyncedAt,
      extraData,
    };
    return user;
  }
}
