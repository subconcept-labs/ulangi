/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Omit } from '@ulangi/extended-types';
import { SetExtraDataName } from '@ulangi/ulangi-common/enums';

export interface SetExtraDataRow {
  readonly userId: string;
  readonly setId: string;
  readonly dataName: SetExtraDataName;
  readonly dataValue: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type SetExtraDataRowForUpsert = Omit<
  SetExtraDataRow,
  'firstSyncedAt' | 'lastSyncedAt'
>;
