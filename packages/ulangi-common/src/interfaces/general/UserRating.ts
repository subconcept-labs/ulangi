/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataName } from '../../enums/UserExtraDataName';

export interface UserRating {
  readonly dataName: UserExtraDataName.USER_RATING;
  readonly dataValue: 1 | 2 | 3 | 4 | 5;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
}
