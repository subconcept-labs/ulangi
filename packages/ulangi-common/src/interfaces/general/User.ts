/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserMembership } from '../../enums/UserMembership';
import { UserStatus } from '../../enums/UserStatus';
import { UserExtraDataItem } from '../../types/UserExtraDataItem';

export interface User {
  readonly userId: string;
  readonly email: string;
  readonly userStatus: UserStatus;
  readonly membership: UserMembership;
  readonly membershipExpiredAt: null | Date;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly firstSyncedAt: Date | null;
  readonly lastSyncedAt: Date | null;
  readonly extraData: readonly UserExtraDataItem[];
}
