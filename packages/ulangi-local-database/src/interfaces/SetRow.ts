/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { SetStatus } from '@ulangi/ulangi-common/enums';

export interface SetRow {
  readonly setLocalId: number;
  readonly setId: string;
  readonly setName: string;
  readonly learningLanguageCode: string;
  readonly translatedToLanguageCode: string;
  readonly setStatus: SetStatus;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly updatedStatusAt: number;
  readonly firstSyncedAt: null | number;
  readonly lastSyncedAt: null | number;
}

export type SetRowForInsert = Omit<SetRow, 'setLocalId'>;

export type SetRowForUpdate = DeepPartial<SetRow>;
