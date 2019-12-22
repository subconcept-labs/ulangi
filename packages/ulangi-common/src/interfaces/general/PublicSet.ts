/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PublicVocabulary } from './PublicVocabulary';

export interface PublicSet {
  readonly publicSetId: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly difficulty: string;
  readonly tags: readonly string[];
  readonly vocabularyList: readonly PublicVocabulary[];
  readonly authors: readonly { name: string; link?: string }[];
  readonly isCurated?: boolean;
}
