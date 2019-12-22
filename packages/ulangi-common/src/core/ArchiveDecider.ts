/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AutoArchiveSettings } from '../interfaces/general/AutoArchiveSettings';

export class ArchiveDecider {
  public shouldArchive(
    currentLevels: {
      spacedRepetitionLevel: number;
      writingLevel: number;
    },
    autoArchiveSettings: AutoArchiveSettings
  ): boolean {
    const {
      autoArchiveEnabled,
      spacedRepetitionLevelThreshold,
      writingLevelThreshold,
    } = autoArchiveSettings;

    return (
      autoArchiveEnabled === true &&
      currentLevels.spacedRepetitionLevel >= spacedRepetitionLevelThreshold &&
      (typeof currentLevels.writingLevel !== 'undefined'
        ? currentLevels.writingLevel
        : 0) >= writingLevelThreshold
    );
  }
}
