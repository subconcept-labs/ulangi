/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { UserMembership, UserStatus } from '@ulangi/ulangi-common/enums';

export interface UserRow {
  readonly userLocalId: number;
  readonly userId: string;
  readonly userStatus: UserStatus;
  readonly email: string;
  readonly membership: UserMembership;
  readonly membershipExpiredAt: null | number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly firstSyncedAt: null | number;
  readonly lastSyncedAt: null | number;
}

export type UserRowForInsert = Omit<UserRow, 'userLocalId'>;

export type UserRowForUpdate = DeepPartial<UserRow>;
