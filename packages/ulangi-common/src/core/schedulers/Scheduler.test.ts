/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

import { Feedback } from '../../enums/Feedback';
import { Scheduler } from './Scheduler';

describe('Scheduler Tests', (): void => {
  const maxLevel = 10;
  let scheduler: Scheduler;

  beforeEach(
    (): void => {
      scheduler = new Scheduler();
    }
  );

  describe('calculateReviewTime', (): void => {
    it('should return the correct review time', (): void => {
      const lastLearnedAt = moment().toDate();

      const reviewTime = scheduler.calculateReviewTime(12, 1, lastLearnedAt);
      // the review time should be 12 hours after last learned
      expect(reviewTime).toEqual(
        moment(lastLearnedAt)
          .add(12, 'hours')
          .toDate()
      );
    });
  });

  describe('calculateReviewTimeFromNow', (): void => {
    it('should return the correct review time from now', (): void => {
      const lastLearnedAt = moment()
        .subtract(11, 'hours')
        .toDate();

      const reviewTime = scheduler.calculateReviewTimeFromNow(
        12,
        1,
        lastLearnedAt
      );
      // Last learned 11 hours ago, so one more hour for next review
      expect(reviewTime).toEqual('in an hour');
    });

    it('should return the correct review time from now in short form', (): void => {
      const lastLearnedAt = moment()
        .subtract(11, 'hours')
        .toDate();

      const reviewTimeShortForm = scheduler.calculateReviewTimeFromNow(
        12,
        1,
        lastLearnedAt,
        true,
        true
      );
      expect(reviewTimeShortForm).toEqual('1h');
    });

    it('should return now if review time has passed', (): void => {
      const lastLearnedAt = moment()
        .subtract(13, 'hours')
        .toDate();

      const reviewTime = scheduler.calculateReviewTimeFromNow(
        12,
        1,
        lastLearnedAt
      );
      // Last learned 13 hours ago so review time has passed,
      // user can review it now
      expect(reviewTime).toEqual('now');
    });

    it('should return now if the review time is equal to the current time', (): void => {
      const lastLearnedAt = moment()
        .subtract(12, 'hours')
        .toDate();

      const reviewTime = scheduler.calculateReviewTimeFromNow(
        12,
        1,
        lastLearnedAt
      );
      expect(reviewTime).toEqual('now');
    });
  });

  describe('calculateWaitingHours', (): void => {
    it('should calculate waiting hours correctly', (): void => {
      expect(scheduler.calculateWaitingHours(12, 0)).toEqual(0);
      expect(scheduler.calculateWaitingHours(12, 1)).toEqual(12);
      expect(scheduler.calculateWaitingHours(12, 2)).toEqual(24);
      expect(scheduler.calculateWaitingHours(12, 3)).toEqual(48);
      expect(scheduler.calculateWaitingHours(12, 4)).toEqual(96);
      expect(scheduler.calculateWaitingHours(12, 5)).toEqual(192);
      expect(scheduler.calculateWaitingHours(12, 6)).toEqual(384);
      expect(scheduler.calculateWaitingHours(12, 7)).toEqual(768);
      expect(scheduler.calculateWaitingHours(12, 8)).toEqual(1536);
      expect(scheduler.calculateWaitingHours(12, 9)).toEqual(3072);
    });
  });

  describe('calculateWaitingHoursInRange', (): void => {
    it('should calculate waiting hours in range correctly', (): void => {
      const levelIntervalPairs = scheduler.calculateWaitingHoursInRange(12, [
        0,
        9,
      ]);
      expect(levelIntervalPairs).toEqual([
        [0, 0],
        [1, 12],
        [2, 24],
        [3, 48],
        [4, 96],
        [5, 192],
        [6, 384],
        [7, 768],
        [8, 1536],
        [9, 3072],
      ]);
    });
  });

  describe('calculateNextLevel', (): void => {
    it('should calculate next level for POOR correctly with 3 levels 0, 5 and 10', (): void => {
      expect(scheduler.calculateNextLevel(0, Feedback.POOR, maxLevel)).toEqual(
        0
      );

      expect(scheduler.calculateNextLevel(5, Feedback.POOR, maxLevel)).toEqual(
        1
      );

      expect(scheduler.calculateNextLevel(10, Feedback.POOR, maxLevel)).toEqual(
        3
      );
    });

    it('should calculate next level for FAIR correctly with 3 levels 0, 5 and 10', (): void => {
      expect(scheduler.calculateNextLevel(0, Feedback.FAIR, maxLevel)).toEqual(
        0
      );

      expect(scheduler.calculateNextLevel(5, Feedback.FAIR, maxLevel)).toEqual(
        3
      );

      expect(scheduler.calculateNextLevel(10, Feedback.FAIR, maxLevel)).toEqual(
        5
      );
    });

    it('should calculate next level for GOOD correctly with 3 levels 0, 5 and 10', (): void => {
      expect(scheduler.calculateNextLevel(0, Feedback.GOOD, maxLevel)).toEqual(
        1
      );

      expect(scheduler.calculateNextLevel(5, Feedback.GOOD, maxLevel)).toEqual(
        6
      );

      expect(scheduler.calculateNextLevel(10, Feedback.GOOD, maxLevel)).toEqual(
        10
      );
    });

    it('should calculate next level for GREAT correctly with 3 levels 0, 5 and 10', (): void => {
      expect(scheduler.calculateNextLevel(0, Feedback.GREAT, maxLevel)).toEqual(
        2
      );

      expect(scheduler.calculateNextLevel(5, Feedback.GREAT, maxLevel)).toEqual(
        7
      );

      expect(
        scheduler.calculateNextLevel(10, Feedback.GREAT, maxLevel)
      ).toEqual(10);
    });

    it('should calculate next level for SUPERB correctly with 3 levels 0, 5 and 10', (): void => {
      expect(
        scheduler.calculateNextLevel(0, Feedback.SUPERB, maxLevel)
      ).toEqual(3);

      expect(
        scheduler.calculateNextLevel(5, Feedback.SUPERB, maxLevel)
      ).toEqual(8);

      expect(
        scheduler.calculateNextLevel(10, Feedback.SUPERB, maxLevel)
      ).toEqual(10);
    });
  });

  describe('calculateNetLevelChange', (): void => {
    it('should calculate net level change for POOR correctly with 3 levels 0, 5 and 10', (): void => {
      expect(
        scheduler.calculateNetLevelChange(0, Feedback.POOR, maxLevel)
      ).toEqual(0);

      expect(
        scheduler.calculateNetLevelChange(5, Feedback.POOR, maxLevel)
      ).toEqual(-4);

      expect(
        scheduler.calculateNetLevelChange(10, Feedback.POOR, maxLevel)
      ).toEqual(-7);
    });

    it('should calculate net level change for FAIR correctly with 3 levels 0, 5 and 10', (): void => {
      expect(
        scheduler.calculateNetLevelChange(0, Feedback.FAIR, maxLevel)
      ).toEqual(0);

      expect(
        scheduler.calculateNetLevelChange(5, Feedback.FAIR, maxLevel)
      ).toEqual(-2);

      expect(
        scheduler.calculateNetLevelChange(10, Feedback.FAIR, maxLevel)
      ).toEqual(-5);
    });

    it('should calculate net level change for GOOD correctly with 3 levels 0, 5 and 10', (): void => {
      expect(
        scheduler.calculateNetLevelChange(0, Feedback.GOOD, maxLevel)
      ).toEqual(1);

      expect(
        scheduler.calculateNetLevelChange(5, Feedback.GOOD, maxLevel)
      ).toEqual(1);

      expect(
        scheduler.calculateNetLevelChange(10, Feedback.GOOD, maxLevel)
      ).toEqual(0);
    });

    it('should calculate net level change for GREAT correctly with 3 levels 0, 5 and 10', (): void => {
      expect(
        scheduler.calculateNetLevelChange(0, Feedback.GREAT, maxLevel)
      ).toEqual(2);

      expect(
        scheduler.calculateNetLevelChange(5, Feedback.GREAT, maxLevel)
      ).toEqual(2);

      expect(
        scheduler.calculateNetLevelChange(10, Feedback.GREAT, maxLevel)
      ).toEqual(0);
    });

    it('should calculate next level for SUPERB correctly with 3 levels 0, 5 and 10', (): void => {
      expect(
        scheduler.calculateNetLevelChange(0, Feedback.SUPERB, maxLevel)
      ).toEqual(3);

      expect(
        scheduler.calculateNetLevelChange(5, Feedback.SUPERB, maxLevel)
      ).toEqual(3);

      expect(
        scheduler.calculateNetLevelChange(10, Feedback.SUPERB, maxLevel)
      ).toEqual(0);
    });
  });
});
