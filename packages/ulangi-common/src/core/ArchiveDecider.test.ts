/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ArchiveDecider } from './ArchiveDecider';

describe('ArchiveDecider', (): void => {
  let archiveDecider: ArchiveDecider;

  beforeEach(
    (): void => {
      archiveDecider = new ArchiveDecider();
    }
  );

  test('should return false when autoArchiveEnabled = false', (): void => {
    const autoArchiveSettings = {
      autoArchiveEnabled: false,
      spacedRepetitionLevelThreshold: 4,
      writingLevelThreshold: 4,
    };
    expect(
      archiveDecider.shouldArchive(
        {
          spacedRepetitionLevel: 5,
          writingLevel: 5,
        },
        autoArchiveSettings
      )
    ).toEqual(false);
  });

  describe('Tests start with autoArchivedEnabled and spacedRepetitionLevelThreshold = 5 and writingLevelThreshold = 5', (): void => {
    const autoArchiveSettings = {
      autoArchiveEnabled: true,
      spacedRepetitionLevelThreshold: 8,
      writingLevelThreshold: 5,
    };

    test('should return true when all conditions are met', (): void => {
      expect(
        archiveDecider.shouldArchive(
          {
            spacedRepetitionLevel: 8,
            writingLevel: 5,
          },
          autoArchiveSettings
        )
      ).toEqual(true);
    });

    test('should return false when one condition is not met', (): void => {
      expect(
        archiveDecider.shouldArchive(
          {
            spacedRepetitionLevel: 7,
            writingLevel: 5,
          },
          autoArchiveSettings
        )
      ).toEqual(false);

      expect(
        archiveDecider.shouldArchive(
          {
            spacedRepetitionLevel: 8,
            writingLevel: 4,
          },
          autoArchiveSettings
        )
      ).toEqual(false);
    });
  });
});
