/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyWriting } from '@ulangi/ulangi-common/interfaces';

import { VocabularyWritingRow } from '../interfaces/VocabularyWritingRow';

export class VocabularyWritingRowConverter {
  public convertToVocabularyWriting(
    vocabularyWritingRow: VocabularyWritingRow
  ): VocabularyWriting {
    const vocabularyWriting: VocabularyWriting = {
      level: vocabularyWritingRow.level,
      lastWrittenAt: vocabularyWritingRow.lastWrittenAt,
      disabled: vocabularyWritingRow.disabled === 1 ? true : false,
      createdAt: vocabularyWritingRow.createdAt,
      updatedAt: vocabularyWritingRow.updatedAt,
      firstSyncedAt: vocabularyWritingRow.firstSyncedAt,
      lastSyncedAt: vocabularyWritingRow.lastSyncedAt,
    };
    return vocabularyWriting;
  }
}
