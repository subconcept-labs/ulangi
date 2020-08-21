/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AbstractResolver } from '@ulangi/resolver';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { Statistics } from '../../interfaces/general/Statistics';

export class StatisticsResolver extends AbstractResolver<Statistics> {
  protected rules = {
    totalReviews: Joi.number(),
    averageReviewsPerDay: Joi.number(),
    latestStreak: Joi.number(),
    longestStreak: Joi.number(),
  };
}
