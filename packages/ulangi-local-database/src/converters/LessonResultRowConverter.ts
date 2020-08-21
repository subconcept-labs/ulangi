/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LessonResult } from '@ulangi/ulangi-common/interfaces';
import * as moment from 'moment';

import { LessonResultRow } from '../interfaces/LessonResultRow';

export class LessonResultRowConverter {
  public convertToLessonResult(lessonResultRow: LessonResultRow): LessonResult {
    return {
      lessonResultId: lessonResultRow.lessonResultId,
      lessonType: lessonResultRow.lessonType,
      setId: lessonResultRow.setId,
      poorCount: lessonResultRow.poorCount,
      fairCount: lessonResultRow.fairCount,
      goodCount: lessonResultRow.goodCount,
      greatCount: lessonResultRow.greatCount,
      superbCount: lessonResultRow.superbCount,
      totalCount: lessonResultRow.totalCount,
      createdAt: moment.unix(lessonResultRow.createdAt).toDate(),
    };
  }
}
