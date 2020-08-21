/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { LessonType } from '../../enums/LessonType';
import { LessonResult } from '../../interfaces/general/LessonResult';

export class LessonResultResolver extends AbstractResolver<LessonResult> {
  protected rules = {
    lessonResultId: Joi.string(),
    lessonType: Joi.string().valid(_.values(LessonType)),
    setId: Joi.string(),
    poorCount: Joi.number(),
    fairCount: Joi.number(),
    goodCount: Joi.number(),
    greatCount: Joi.number(),
    superbCount: Joi.number(),
    totalCount: Joi.number(),
    createdAt: Joi.date(),
  };
}
