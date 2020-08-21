/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';

import { LessonType } from '../enums/LessonType';
import { LessonResult } from '../interfaces/general/LessonResult';

export class LessonResultBuilder {
  public build(lessonResult: Partial<LessonResult>): LessonResult {
    return _.merge(
      {
        lessonResultId: uuid.v4(),
        lessonType: LessonType.SPACED_REPETITION,
        setId: uuid.v4(),
        poorCount: 0,
        fairCount: 0,
        goodCount: 0,
        greatCount: 0,
        superbCount: 0,
        totalCount: 0,
        createdAt: moment().toDate(),
      },
      lessonResult
    );
  }
}
