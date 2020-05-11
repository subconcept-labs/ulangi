/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PublicDefinition } from './PublicDefinition';

export interface PublicVocabulary {
  readonly publicVocabularyId: string;
  readonly vocabularyText: string;
  readonly definitions: readonly PublicDefinition[];
  readonly categories: readonly string[];
  readonly sources?: readonly string[];
}
