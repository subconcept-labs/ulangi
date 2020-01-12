/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { ReviewStrategy } from '../../enums/ReviewStrategy';
import { SetExtraDataName } from '../../enums/SetExtraDataName';
import { SpacedRepetitionReviewStrategy } from '../../interfaces/general/SpacedRepetitionReviewStrategy';

export class SpacedRepetitionReviewStrategyResolver extends AbstractResolver<
  SpacedRepetitionReviewStrategy
> {
  protected rules = {
    dataName: Joi.string().valid(
      SetExtraDataName.SPACED_REPETITION_REVIEW_STRATEGY
    ),
    dataValue: Joi.string().valid(_.values(ReviewStrategy)),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    firstSyncedAt: Joi.date().allow(null),
    lastSyncedAt: Joi.date().allow(null),
  };
}
