/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
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
      sources: entry.sources,
    };
  }

  private getExtraFields(entry: DictionaryEntry): string[] {
    const extraFields: string[] = [];

    const mapping: { [P in keyof Partial<DictionaryEntry>]: string } = {
      reading: 'reading',
      hiragana: 'hiragana',
      romaji: 'romaji',
      pinyin: 'pinyin',
      zhuyin: 'zhuyin',
      simplified: 'simplified',
      traditional: 'traditional',
      romanization: 'romanization',
      ipa: 'ipa',
      gender: 'gender',
      plural: 'plural',
      feminine: 'female',
      masculine: 'male',
    };

    for (const key of Object.keys(mapping) as (keyof DictionaryEntry)[]) {
      if (typeof entry[key] !== 'undefined' && Array.isArray(entry[key])) {
        const fieldName = assertExists(mapping[key]);

        const values = entry[key] as string[];

        extraFields.push(
          ...assertExists(
            values.map((value): string => `[${fieldName}: ${value}]`)
          )
        );
      }
    }

    return extraFields;
  }

  public convertToSimplifiedFirst(
    dictionaryEntry: DictionaryEntry
  ): DictionaryEntry {
    if (
      typeof dictionaryEntry.simplified !== 'undefined' &&
      dictionaryEntry.simplified.length > 0
    ) {
      return {
        ...dictionaryEntry,
        vocabularyTerm: dictionaryEntry.simplified[0],
        traditional: [dictionaryEntry.vocabularyTerm],
        simplified: undefined,
      };
    } else {
      return dictionaryEntry;
    }
  }
}
