/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DictionaryEntry } from '@ulangi/wiktionary-core';
import * as uuid from 'uuid';

import { PublicVocabulary } from '../interfaces/general/PublicVocabulary';

export class DictionaryEntryConverter {
  public convertDictionaryEntriesToPublicVocabulary(
    dictionaryEntries: DictionaryEntry[]
  ): PublicVocabulary[] {
    return dictionaryEntries.map(
      (entry): PublicVocabulary => {
        return this.convertDictionaryEntryToPublicVocabulary(entry);
      }
    );
  }

  public convertDictionaryEntryToPublicVocabulary(
    entry: DictionaryEntry
  ): PublicVocabulary {
    return {
      publicVocabularyId: uuid.v4(),
      vocabularyText: [
        entry.vocabularyTerm,
        ...this.getExtraFields(entry),
      ].join('\n'),
      definitions: entry.definitions,
      categories: entry.categories,
    };
  }

  private getExtraFields(entry: DictionaryEntry): string[] {
    const extraFields: string[] = [];
    if (typeof entry.ipa !== 'undefined') {
      extraFields.push(...entry.ipa.map((ipa): string => `[ipa: ${ipa}]`));
    }

    if (typeof entry.pinyin !== 'undefined') {
      extraFields.push(
        ...entry.pinyin.map((pinyin): string => `[pinyin: ${pinyin}]`)
      );
    }

    if (typeof entry.romanization !== 'undefined') {
      extraFields.push(
        ...entry.romanization.map(
          (romanization): string => `[romanization: ${romanization}]`
        )
      );
    }

    if (typeof entry.romaji !== 'undefined') {
      extraFields.push(
        ...entry.romaji.map((romaji): string => `[romaji: ${romaji}]`)
      );
    }

    return extraFields;
  }
}
