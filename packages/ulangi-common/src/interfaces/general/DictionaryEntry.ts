/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DictionaryDefinition } from './DictionaryDefinition';

export interface DictionaryEntry {
  readonly vocabularyTerm: string;
  readonly definitions: readonly DictionaryDefinition[];
  readonly categories: string[];
  readonly tags: string[];
  readonly ipa?: string[];
  readonly pinyin?: string[];
  readonly romaji?: string[];
  readonly romanization?: string[];
}
