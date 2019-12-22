/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { FieldState } from '../enums/FieldState';

export interface DirtyVocabularyWritingFieldRow {
  readonly vocabularyId: string;
  readonly fieldName: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly fieldState: FieldState;
}
