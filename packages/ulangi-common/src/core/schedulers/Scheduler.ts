/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import * as moment from 'moment';

import { Feedback } from '../../enums/Feedback';
import { timeFromNow } from '../../utils/timeFromNow';

export class Scheduler {
  public calculateNextLevel(
    currentLevel: number,
    feedback: Feedback,
    maxLevel: number
  ): number {
    let nextLevel = 0;

    switch (feedback) {
      case Feedback.POOR: {
        nextLevel = Math.round(currentLevel / 4);
        break;
      }
      case Feedback.FAIR: {
        nextLevel = Math.round(currentLevel / 2);
        break;
      }
      case Feedback.GOOD: {
        nextLevel = currentLevel + 1;
        break;
      }
      case Feedback.GREAT: {
        nextLevel = currentLevel + 2;
        break;
      }
      case Feedback.SUPERB: {
        nextLevel = currentLevel + 3;
        break;
      }
      default:
        throw new Error(`Missing case for ${feedback}`);
    }

    if (nextLevel < 0) {
      throw new Error('Level cannot be smaller than 0');
    }

    return Math.min(maxLevel, nextLevel);
  }

  public calculateNetLevelChange(
    currentLevel: number,
    feedback: Feedback,
    maxLevel: number
  ): number {
    return (
      this.calculateNextLevel(currentLevel, feedback, maxLevel) - currentLevel
    );
  }

  public calculateReviewTime(
    initialInterval: number,
    currentLevel: number,
    lastReviewed: Date
  ): Date {
    const hours = this.calculateWaitingHours(initialInterval, currentLevel);
    const nextReviewTime = moment(lastReviewed).add(hours, 'hours');
    return nextReviewTime.toDate();
  }

  public calculateReviewTimeFromNow(
    initialInterval: number,
    currentLevel: number,
    lastReviewed: Date,
    shortForm?: boolean,
    withoutSuffix?: boolean
  ): string {
    const reviewTime = this.calculateReviewTime(
      initialInterval,
      currentLevel,
      lastReviewed
    );

    if (moment(reviewTime).unix() <= moment().unix()) {
      return 'now';
    } else {
      return timeFromNow(reviewTime, shortForm, withoutSuffix);
    }
  }

  public calculateWaitingHours(initialInterval: number, level: number): number {
    if (level === 0) {
      return 0;
    } else {
      return initialInterval * Math.pow(2, level - 1);
    }
  }

  public calculateWaitingHoursInRange(
    initialInterval: number,
    range: [number, number]
  ): readonly [number, number][] {
    const [start, end] = range;
    return _.range(start, end + 1).map(
      (level): [number, number] => {
        return [level, this.calculateWaitingHours(initialInterval, level)];
      }
    );
  }
}
