/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { NativeDefinition } from './NativeDefinition';

export interface NativeVocabulary {
  readonly nativeVocabularyId: string;
  readonly vocabularyText: string;
  readonly order: number;
  readonly definitions: readonly NativeDefinition[];
}
