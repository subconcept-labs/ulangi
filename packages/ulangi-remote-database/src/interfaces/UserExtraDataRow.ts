/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';

export interface UserExtraDataRow {
  readonly userId: string;
  readonly dataName: UserExtraDataName;
  readonly dataValue: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type UserExtraDataRowForUpsert = DeepPartial<UserExtraDataRow>;
