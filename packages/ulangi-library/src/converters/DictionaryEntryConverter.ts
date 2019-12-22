/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  DictionaryEntry,
  PublicVocabulary,
} from '@ulangi/ulangi-common/interfaces';
import * as uuid from 'uuid';

export class DictionaryEntryConverter {
  public convertDictionaryEntriesToPublicVocabulary(
    dictionaryEntries: DictionaryEntry[]
  ): PublicVocabulary[] {
    return dictionaryEntries.map(
      (entry): PublicVocabulary => {
        return {
          publicVocabularyId: uuid.v4(),
          vocabularyText: entry.vocabularyText,
          definitions: entry.definitions,
          categories: entry.categories,
        };
      }
    );
  }
}
