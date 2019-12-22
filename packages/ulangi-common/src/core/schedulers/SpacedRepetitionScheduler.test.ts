/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

import { VocabularyBuilder } from '../../builders/VocabularyBuilder';
import { Feedback } from '../../enums/Feedback';
import { SpacedRepetitionScheduler } from './SpacedRepetitionScheduler';

describe('SpacedRepetitionScheduler Tests', (): void => {
  const maxLevel = 10;
  let spacedRepetitionScheduler: SpacedRepetitionScheduler;

  beforeEach(
    (): void => {
      spacedRepetitionScheduler = new SpacedRepetitionScheduler();
    }
  );

  describe('getNextLevel', (): void => {
    it(`return next level for POOR correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, nextLevel: 0 },
        { currentLevel: 5, nextLevel: 1 },
        { currentLevel: 10, nextLevel: 3 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextLevel(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.POOR,
              maxLevel
            )
          ).toEqual(result.nextLevel);
        }
      );
    });

    it(`return next level for FAIR correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, nextLevel: 0 },
        { currentLevel: 5, nextLevel: 3 },
        { currentLevel: 10, nextLevel: 5 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextLevel(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.FAIR,
              maxLevel
            )
          ).toEqual(result.nextLevel);
        }
      );
    });

    it(`return next level for GOOD correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, nextLevel: 1 },
        { currentLevel: 5, nextLevel: 6 },
        { currentLevel: 10, nextLevel: 10 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextLevel(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.GOOD,
              maxLevel
            )
          ).toEqual(result.nextLevel);
        }
      );
    });

    it(`return next level for GREAT correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, nextLevel: 2 },
        { currentLevel: 5, nextLevel: 7 },
        { currentLevel: 10, nextLevel: 10 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextLevel(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.GREAT,
              maxLevel
            )
          ).toEqual(result.nextLevel);
        }
      );
    });

    it(`return next level for SUPERB correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, nextLevel: 3 },
        { currentLevel: 5, nextLevel: 8 },
        { currentLevel: 10, nextLevel: 10 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextLevel(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.SUPERB,
              maxLevel
            )
          ).toEqual(result.nextLevel);
        }
      );
    });
  });

  describe('getNetLevelChange', (): void => {
    it(`return net level change for POOR correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, netLevelChange: 0 },
        { currentLevel: 5, netLevelChange: -4 },
        { currentLevel: 10, netLevelChange: -7 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNetLevelChange(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.POOR,
              maxLevel
            )
          ).toEqual(result.netLevelChange);
        }
      );
    });

    it(`return net level change for FAIR correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, netLevelChange: 0 },
        { currentLevel: 5, netLevelChange: -2 },
        { currentLevel: 10, netLevelChange: -5 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNetLevelChange(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.FAIR,
              maxLevel
            )
          ).toEqual(result.netLevelChange);
        }
      );
    });

    it(`return net level change for GOOD correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, netLevelChange: 1 },
        { currentLevel: 5, netLevelChange: 1 },
        { currentLevel: 10, netLevelChange: 0 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNetLevelChange(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.GOOD,
              maxLevel
            )
          ).toEqual(result.netLevelChange);
        }
      );
    });

    it(`return net level change for GREAT correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, netLevelChange: 2 },
        { currentLevel: 5, netLevelChange: 2 },
        { currentLevel: 10, netLevelChange: 0 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNetLevelChange(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.GREAT,
              maxLevel
            )
          ).toEqual(result.netLevelChange);
        }
      );
    });

    it(`return net level change for SUPERB correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, netLevelChange: 3 },
        { currentLevel: 5, netLevelChange: 3 },
        { currentLevel: 10, netLevelChange: 0 },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNetLevelChange(
              new VocabularyBuilder().build({ level: result.currentLevel }),
              Feedback.SUPERB,
              maxLevel
            )
          ).toEqual(result.netLevelChange);
        }
      );
    });
  });

  describe('getReviewTimeFromNow', (): void => {
    it(`return review time from now correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, reviewTimeFromNow: 'now' },
        { currentLevel: 1, reviewTimeFromNow: 'in 12 hours' },
        { currentLevel: 5, reviewTimeFromNow: 'in 8 days' },
        { currentLevel: 10, reviewTimeFromNow: 'done' },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getReviewTimeFromNow(
              12,
              new VocabularyBuilder().build({
                level: result.currentLevel,
                lastLearnedAt: moment().toDate(),
              }),
              maxLevel
            )
          ).toEqual(result.reviewTimeFromNow);
        }
      );
    });

    it(`return review time from now in short form correctly`, (): void => {
      const expectedResults = [
        { currentLevel: 0, reviewTimeFromNow: 'now' },
        { currentLevel: 1, reviewTimeFromNow: '12h' },
        { currentLevel: 5, reviewTimeFromNow: '8d' },
        { currentLevel: 10, reviewTimeFromNow: 'done' },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getReviewTimeFromNow(
              12,
              new VocabularyBuilder().build({
                level: result.currentLevel,
                lastLearnedAt: moment().toDate(),
              }),
              maxLevel,
              true,
              true
            )
          ).toEqual(result.reviewTimeFromNow);
        }
      );
    });
  });

  describe('getNextReviewTimeFromNow', (): void => {
    it(`return next review time from now correctly`, (): void => {
      const autoArchiveSettings = {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 10,
        writingLevelThreshold: 10,
      };

      const expectedResults = [
        { currentLevel: 0, nextReviewTimeFromNow: 'in 12 hours' },
        { currentLevel: 5, nextReviewTimeFromNow: 'in 16 days' },
        { currentLevel: 10, nextReviewTimeFromNow: 'done' },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextReviewTimeFromNow(
              12,
              new VocabularyBuilder().build({
                level: result.currentLevel,
              }),
              Feedback.GOOD,
              maxLevel,
              autoArchiveSettings
            )
          ).toEqual(result.nextReviewTimeFromNow);
        }
      );
    });

    it(`return next review time from now in short form correctly`, (): void => {
      const autoArchiveSettings = {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 10,
        writingLevelThreshold: 10,
      };

      const expectedResults = [
        { currentLevel: 0, nextReviewTimeFromNow: '12h' },
        { currentLevel: 5, nextReviewTimeFromNow: '16d' },
        { currentLevel: 10, nextReviewTimeFromNow: 'done' },
      ];
      expectedResults.forEach(
        (result): void => {
          expect(
            spacedRepetitionScheduler.getNextReviewTimeFromNow(
              12,
              new VocabularyBuilder().build({
                level: result.currentLevel,
              }),
              Feedback.GOOD,
              maxLevel,
              autoArchiveSettings,
              true,
              true
            )
          ).toEqual(result.nextReviewTimeFromNow);
        }
      );
    });

    it('should return done if archive conditions are met', (): void => {
      const autoArchiveSettings = {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 5,
        writingLevelThreshold: 5,
      };
      expect(
        spacedRepetitionScheduler.getNextReviewTimeFromNow(
          12,
          new VocabularyBuilder().build({
            level: 4,
            writing: {
              level: 5,
            },
          }),
          Feedback.GOOD,
          maxLevel,
          autoArchiveSettings
        )
      ).toEqual('done');
    });
  });

  describe('willBeArchived', (): void => {
    it(`return true if archive conditions are met`, (): void => {
      const autoArchiveSettings = {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 5,
        writingLevelThreshold: 5,
      };

      expect(
        spacedRepetitionScheduler.willBeArchived(
          new VocabularyBuilder().build({
            level: 4,
            writing: {
              level: 5,
            },
          }),
          Feedback.GOOD,
          maxLevel,
          autoArchiveSettings
        )
      ).toEqual(true);
    });

    it('should return false if archive conditions are not met', (): void => {
      const autoArchiveSettings = {
        autoArchiveEnabled: true,
        spacedRepetitionLevelThreshold: 6,
        writingLevelThreshold: 5,
      };

      expect(
        spacedRepetitionScheduler.willBeArchived(
          new VocabularyBuilder().build({
            level: 4,
            writing: {
              level: 5,
            },
          }),
          Feedback.GOOD,
          maxLevel,
          autoArchiveSettings
        )
      ).toEqual(false);
    });

    it('should return false if archive conditions are disabled', (): void => {
      const autoArchiveSettings = {
        autoArchiveEnabled: false,
        spacedRepetitionLevelThreshold: 5,
        writingLevelThreshold: 5,
      };

      expect(
        spacedRepetitionScheduler.willBeArchived(
          new VocabularyBuilder().build({
            level: 4,
            writing: {
              level: 5,
            },
          }),
          Feedback.GOOD,
          maxLevel,
          autoArchiveSettings
        )
      ).toEqual(false);
    });
  });
});
