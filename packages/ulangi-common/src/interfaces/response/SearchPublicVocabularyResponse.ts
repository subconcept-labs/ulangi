/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PublicVocabulary } from '../../interfaces/general/PublicVocabulary';

export interface SearchPublicVocabularyResponse {
  readonly vocabularyList: readonly PublicVocabulary[];
  readonly nextOffset: null | number;
}
