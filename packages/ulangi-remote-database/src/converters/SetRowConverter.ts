/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Set } from '@ulangi/ulangi-common/interfaces';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';

import { SetRow } from '../interfaces/SetRow';

export class SetRowConverter {
  public convertToSet(
    setRow: SetRow,
    extraData: readonly SetExtraDataItem[]
  ): Set {
    const set: Set = {
      setId: setRow.setId,
      setName: setRow.setName,
      setStatus: setRow.setStatus,
      learningLanguageCode: setRow.learningLanguageCode,
      translatedToLanguageCode: setRow.translatedToLanguageCode,
      createdAt: setRow.createdAt,
      updatedAt: setRow.updatedAt,
      updatedStatusAt: setRow.updatedStatusAt,
      firstSyncedAt: setRow.firstSyncedAt,
      lastSyncedAt: setRow.lastSyncedAt,
      extraData,
    };
    return set;
  }
}
