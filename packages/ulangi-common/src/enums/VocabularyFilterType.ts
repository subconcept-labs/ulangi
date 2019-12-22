/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyDueType } from './VocabularyDueType';
import { VocabularyStatus } from './VocabularyStatus';

export enum VocabularyFilterType {
  ACTIVE = VocabularyStatus.ACTIVE,
  DUE_BY_SPACED_REPETITION = VocabularyDueType.DUE_BY_SPACED_REPETITION,
  DUE_BY_WRITING = VocabularyDueType.DUE_BY_WRITING,
  ARCHIVED = VocabularyStatus.ARCHIVED,
  DELETED = VocabularyStatus.DELETED,
}
