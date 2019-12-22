/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { NativeVocabulary } from './NativeVocabulary';

export interface NativeSet {
  readonly nativeSetId: string;
  readonly languageCodePair: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly difficulty: string;
  readonly tags: readonly string[];
  readonly vocabularyList: readonly NativeVocabulary[];
  readonly author?: string;
  readonly link?: string;
}
