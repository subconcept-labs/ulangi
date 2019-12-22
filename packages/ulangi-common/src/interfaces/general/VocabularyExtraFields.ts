/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface VocabularyExtraFields {
  // All languages
  readonly ipa: readonly string[][];
  readonly pronunciation: readonly string[][];
  readonly note: readonly string[][];

  // English
  readonly present: readonly string[][];
  readonly past: readonly string[][];
  readonly pastParticiple: readonly string[][];
  readonly singular: readonly string[][];
  readonly plural: readonly string[][];

  // Japanese
  readonly kanji: readonly string[][];
  readonly hiragana: readonly string[][];
  readonly katakana: readonly string[][];
  readonly romaji: readonly string[][];

  // Chinese
  readonly pinyin: readonly string[][];
  readonly simplified: readonly string[][];
  readonly traditional: readonly string[][];

  // German, French, Italy, Spanish
  readonly gender: readonly string[][];
  readonly female: readonly string[][];
  readonly male: readonly string[][];
}
