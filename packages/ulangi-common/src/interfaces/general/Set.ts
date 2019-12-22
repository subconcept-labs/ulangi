/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetStatus } from '../../enums/SetStatus';
import { SetExtraDataItem } from '../../types/SetExtraDataItem';

export interface Set {
  readonly setId: string;
  readonly setName: string;
  readonly learningLanguageCode: string;
  readonly translatedToLanguageCode: string;
  readonly setStatus: SetStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly updatedStatusAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
  readonly extraData: readonly SetExtraDataItem[];
}
