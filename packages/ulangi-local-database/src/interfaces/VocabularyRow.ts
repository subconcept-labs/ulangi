/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';

export interface VocabularyRow {
  readonly vocabularyLocalId: number;
  readonly vocabularyId: string;
  readonly setId: string;
  readonly vocabularyStatus: VocabularyStatus;
  readonly vocabularyText: string;
  readonly level: number;
  readonly lastLearnedAt: null | number;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly updatedStatusAt: number;
  readonly firstSyncedAt: null | number;
  readonly lastSyncedAt: null | number;
}

export type VocabularyRowForInsert = Omit<VocabularyRow, 'vocabularyLocalId'>;

export type VocabularyRowForUpdate = DeepPartial<VocabularyRow>;
