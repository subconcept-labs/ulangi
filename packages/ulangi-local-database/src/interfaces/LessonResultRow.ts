/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Omit } from '@ulangi/extended-types';
import { LessonType } from '@ulangi/ulangi-common/enums';

export interface LessonResultRow {
  readonly lessonResultLocalId: number;
  readonly lessonResultId: string;
  readonly lessonType: LessonType;
  readonly setId: string;
  readonly poorCount: number;
  readonly fairCount: number;
  readonly goodCount: number;
  readonly greatCount: number;
  readonly superbCount: number;
  readonly totalCount: number;
  readonly createdAt: number;
}

export type LessonResultRowForInsert = Omit<
  LessonResultRow,
  'lessonResultLocalId'
>;
