/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';

export interface VocabularyWritingRow {
  readonly vocabularyWritingLocalId: number;
  readonly vocabularyId: string;
  readonly lastWrittenAt: null | number;
  readonly level: number;
  readonly disabled: number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly firstSyncedAt: null | number;
  readonly lastSyncedAt: null | number;
}

export type VocabularyWritingRowForUpsert = DeepPartial<VocabularyWritingRow>;
