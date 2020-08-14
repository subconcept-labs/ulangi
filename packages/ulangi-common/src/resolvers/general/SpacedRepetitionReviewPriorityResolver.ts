/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { ReviewPriority } from '../../enums/ReviewPriority';
import { SetExtraDataName } from '../../enums/SetExtraDataName';
import { SpacedRepetitionReviewPriority } from '../../interfaces/general/SpacedRepetitionReviewPriority';

export class SpacedRepetitionReviewPriorityResolver extends AbstractResolver<
  SpacedRepetitionReviewPriority
> {
  protected rules = {
    dataName: Joi.string().valid(
      SetExtraDataName.SPACED_REPETITION_REVIEW_PRIORITY
    ),
    dataValue: Joi.string().valid(_.values(ReviewPriority)),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
