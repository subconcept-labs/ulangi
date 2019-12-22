/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, Omit } from '@ulangi/extended-types';
import { VocabularyStatus } from '@ulangi/ulangi-common/enums';

export interface VocabularyRow {
  readonly vocabularyId: string;
  readonly userId: string;
  readonly setId: string;
  readonly vocabularyStatus: VocabularyStatus;
  readonly vocabularyText: string;
  readonly level: number;
  readonly lastLearnedAt: null | Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly updatedStatusAt: Date;
  readonly firstSyncedAt: Date;
  readonly lastSyncedAt: Date;
}

export type VocabularyRowForInsert = Omit<
  VocabularyRow,
  'firstSyncedAt' | 'lastSyncedAt'
>;
export type VocabularyRowForUpdate = DeepPartial<VocabularyRow>;
