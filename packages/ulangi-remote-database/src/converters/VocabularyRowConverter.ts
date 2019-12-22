/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  Definition,
  Vocabulary,
  VocabularyCategory,
  VocabularyWriting,
} from '@ulangi/ulangi-common/interfaces';

import { VocabularyRow } from '../interfaces/VocabularyRow';

export class VocabularyRowConverter {
  public convertToVocabulary(
    vocabularyRow: VocabularyRow,
    definitions: readonly Definition[],
    category: undefined | VocabularyCategory,
    writing: undefined | VocabularyWriting
  ): Vocabulary {
    const vocabulary: Vocabulary = {
      vocabularyId: vocabularyRow.vocabularyId,
      vocabularyText: vocabularyRow.vocabularyText,
      vocabularyStatus: vocabularyRow.vocabularyStatus,
      definitions,
      category,
      writing,
      level: vocabularyRow.level,
      lastLearnedAt: vocabularyRow.lastLearnedAt,
      createdAt: vocabularyRow.createdAt,
      updatedAt: vocabularyRow.updatedAt,
      updatedStatusAt: vocabularyRow.updatedStatusAt,
      firstSyncedAt: vocabularyRow.firstSyncedAt,
      lastSyncedAt: vocabularyRow.lastSyncedAt,
      extraData: [],
    };
    return vocabulary;
  }
}
