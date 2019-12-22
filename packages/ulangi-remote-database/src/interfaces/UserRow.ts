/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { UserMembership, UserStatus } from '@ulangi/ulangi-common/enums';

export interface UserRow {
  readonly userId: string;
  readonly shardId: number;
  readonly email: string;
  readonly password: string;
  readonly accessKey: string;
  readonly userStatus: UserStatus;
  readonly membership: UserMembership;
  readonly membershipExpiredAt: null | Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type UserRowForInsert = Omit<
  UserRow,
  'createdAt' | 'updatedAt' | 'firstSyncedAt' | 'lastSyncedAt'
>;
export type UserRowForUpdate = DeepPartial<UserRow>;
