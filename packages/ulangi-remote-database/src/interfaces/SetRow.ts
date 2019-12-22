/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { SetStatus } from '@ulangi/ulangi-common/enums';

export interface SetRow {
  readonly setId: string;
  readonly userId: string;
  readonly setName: string;
  readonly setStatus: SetStatus;
  readonly learningLanguageCode: string;
  readonly translatedToLanguageCode: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly updatedStatusAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type SetRowForInsert = Omit<SetRow, 'firstSyncedAt' | 'lastSyncedAt'>;
export type SetRowForUpdate = DeepPartial<SetRow>;
