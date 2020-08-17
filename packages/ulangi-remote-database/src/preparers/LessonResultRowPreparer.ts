/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { LessonType } from '@ulangi/ulangi-common/enums';
import { LessonResult } from '@ulangi/ulangi-common/interfaces';
import { AbstractPreparer } from '@ulangi/ulangi-common/preparers';
import * as Joi from 'joi';
import * as _ from 'lodash';

import {
  LessonResultRow,
  LessonResultRowForInsert,
} from '../interfaces/LessonResultRow';

export class LessonResultRowPreparer extends AbstractPreparer<LessonResultRow> {
  protected insertRules = {
    userId: Joi.string(),
    lessonResultId: Joi.string(),
    lessonType: Joi.string().valid(_.values(LessonType)),
    setId: Joi.string(),
    totalCount: Joi.number(),
    poorCount: Joi.number(),
    fairCount: Joi.number(),
    goodCount: Joi.number(),
    greatCount: Joi.number(),
    superbCount: Joi.number(),
    createdAt: Joi.date(),
  };

  public prepareInsert(
    userId: string,
    lessonResult: LessonResult
  ): LessonResultRowForInsert {
    const lessonResultRow = this.convertToInsertRow(userId, lessonResult);

    return this.validateData(
      lessonResultRow,
      this.insertRules
    ) as LessonResultRowForInsert;
  }

  private convertToInsertRow(
    userId: string,
    lessonResult: LessonResult
  ): DeepPartial<LessonResultRow> {
    const lessonResultRow: LessonResultRowForInsert = {
      userId,
      lessonResultId: lessonResult.lessonResultId,
      lessonType: lessonResult.lessonType,
      setId: lessonResult.setId,
      poorCount: lessonResult.poorCount,
      fairCount: lessonResult.fairCount,
      goodCount: lessonResult.goodCount,
      greatCount: lessonResult.greatCount,
      superbCount: lessonResult.superbCount,
      totalCount: lessonResult.totalCount,
      createdAt: lessonResult.createdAt,
    };

    return lessonResultRow;
  }
}
