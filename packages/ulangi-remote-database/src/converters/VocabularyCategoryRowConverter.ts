/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';

import { VocabularyCategoryRow } from '../interfaces/VocabularyCategoryRow';

export class VocabularyCategoryRowConverter {
  public convertToVocabularyCategory(
    vocabularyCategoryRow: VocabularyCategoryRow
  ): VocabularyCategory {
    const vocabularyCategory: VocabularyCategory = {
      categoryName: vocabularyCategoryRow.categoryName,
      createdAt: vocabularyCategoryRow.createdAt,
      updatedAt: vocabularyCategoryRow.updatedAt,
      firstSyncedAt: vocabularyCategoryRow.firstSyncedAt,
      lastSyncedAt: vocabularyCategoryRow.lastSyncedAt,
    };
    return vocabularyCategory;
  }
}
