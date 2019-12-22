/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyStatus } from '../../enums/VocabularyStatus';
import { Definition } from '../../interfaces/general/Definition';
import { VocabularyCategory } from './VocabularyCategory';
import { VocabularyWriting } from './VocabularyWriting';

export interface Vocabulary {
  readonly vocabularyId: string;
  readonly vocabularyText: string;
  readonly vocabularyStatus: VocabularyStatus;
  readonly definitions: readonly Definition[];
  readonly level: number;
  readonly lastLearnedAt: null | Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly updatedStatusAt: Date;
  readonly firstSyncedAt: null | Date;
  readonly lastSyncedAt: null | Date;
  readonly extraData: readonly any[];
  readonly category?: VocabularyCategory;
  readonly writing?: VocabularyWriting;
}
