/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Omit } from '@ulangi/extended-types';
import { UserExtraDataName } from '@ulangi/ulangi-common/enums';

import { FieldState } from '../enums/FieldState';

export interface UserExtraDataRow {
  readonly extraDataLocalId: number;
  readonly userId: string;
  readonly dataName: UserExtraDataName;
  readonly dataValue: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly firstSyncedAt: null | number;
  readonly lastSyncedAt: null | number;
  readonly fieldState: FieldState;
}

export type UserExtraDataRowForUpsert = Omit<
  UserExtraDataRow,
  'extraDataLocalId'
>;
