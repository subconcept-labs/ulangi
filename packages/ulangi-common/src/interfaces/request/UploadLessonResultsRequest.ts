/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LessonResult } from '../general/LessonResult';
import { Request } from './Request';

export interface UploadLessonResultsRequest extends Request {
  readonly path: '/upload-lesson-results';
  readonly method: 'post';
  readonly authRequired: true;
  readonly query: null;
  readonly body: {
    readonly lessonResults: readonly LessonResult[];
  };
}
