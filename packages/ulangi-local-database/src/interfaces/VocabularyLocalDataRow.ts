/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';

export interface VocabularyLocalDataRow {
  readonly vocabularyLocalDataId: number;
  readonly vocabularyId: string;
  readonly vocabularyTerm: null | string;
}

export type VocabularyLocalDataRowForUpsert = DeepPartial<
  VocabularyLocalDataRow
>;
