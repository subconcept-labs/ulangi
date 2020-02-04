/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';

import { SetExtraDataName } from '../../enums/SetExtraDataName';
import { WritingFeedbackButtons } from '../../interfaces/general/WritingFeedbackButtons';

export class WritingFeedbackButtonsResolver extends AbstractResolver<
  WritingFeedbackButtons
> {
  protected rules = {
    dataName: Joi.string().valid(SetExtraDataName.WRITING_FEEDBACK_BUTTONS),
    dataValue: Joi.number().valid([3, 4, 5]),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
