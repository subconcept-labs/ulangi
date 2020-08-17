/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as Joi from 'joi';

import { UploadLessonResultsRequest } from '../../interfaces/request/UploadLessonResultsRequest';
import { LessonResultResolver } from '../general/LessonResultResolver';
import { RequestResolver } from './RequestResolver';

export class UploadLessonResultsRequestResolver extends RequestResolver<
  UploadLessonResultsRequest
> {
  private lessonResultResolver = new LessonResultResolver();

  protected rules = {
    query: Joi.strip(),
    body: {
      lessonResults: Joi.array().items(this.lessonResultResolver.getRules()),
    },
  };
}
