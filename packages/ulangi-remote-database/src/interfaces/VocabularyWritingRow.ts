/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';

export interface VocabularyWritingRow {
  readonly userId: string;
  readonly vocabularyId: string;
  readonly level: number;
  readonly lastWrittenAt: null | Date;
  readonly disabled: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type VocabularyWritingRowForUpsert = DeepPartial<VocabularyWritingRow>;
