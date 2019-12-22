/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

import { Feedback } from '../../enums/Feedback';
import { AutoArchiveSettings } from '../../interfaces/general/AutoArchiveSettings';
import { Vocabulary } from '../../interfaces/general/Vocabulary';
import { ArchiveDecider } from '../ArchiveDecider';
import { Scheduler } from './Scheduler';

export class WritingScheduler extends Scheduler {
  private archiveDecider = new ArchiveDecider();

  public getNextLevel(
    vocabulary: Vocabulary,
    feedback: Feedback,
    maxLevel: number
  ): number {
    return this.calculateNextLevel(
      this.getCurrentWritingLevel(vocabulary),
      feedback,
      maxLevel
    );
  }

  public getNetLevelChange(
    vocabulary: Vocabulary,
    feedback: Feedback,
    maxLevel: number
  ): number {
    return this.calculateNetLevelChange(
      this.getCurrentWritingLevel(vocabulary),
      feedback,
      maxLevel
    );
  }

  public getReviewTimeFromNow(
    initialInterval: number,
    vocabulary: Vocabulary,
    maxLevel: number,
    shortForm?: boolean,
    withoutSuffix?: boolean
  ): string {
    const currentLevel = this.getCurrentWritingLevel(vocabulary);
    if (currentLevel >= maxLevel) {
      return 'done';
    } else if (
      typeof vocabulary.writing === 'undefined' ||
      vocabulary.writing.lastWrittenAt === null
    ) {
      return 'now';
    } else {
      return this.calculateReviewTimeFromNow(
        initialInterval,
        currentLevel,
        moment(vocabulary.writing.lastWrittenAt).toDate(),
        shortForm,
        withoutSuffix
      );
    }
  }

  public getNextReviewTimeFromNow(
    initialInterval: number,
    vocabulary: Vocabulary,
    feedback: Feedback,
    maxLevel: number,
    autoArchiveSettings: AutoArchiveSettings,
    shortForm?: boolean,
    withoutSuffix?: boolean
  ): string {
    const nextLevel = this.getNextLevel(vocabulary, feedback, maxLevel);
    if (
      nextLevel >= maxLevel ||
      this.willBeArchived(vocabulary, feedback, maxLevel, autoArchiveSettings)
    ) {
      return 'done';
    } else {
      return this.calculateReviewTimeFromNow(
        initialInterval,
        nextLevel,
        moment().toDate(),
        shortForm,
        withoutSuffix
      );
    }
  }

  public willBeArchived(
    vocabulary: Vocabulary,
    feedback: Feedback,
    maxLevel: number,
    autoArchiveSettings: AutoArchiveSettings
  ): boolean {
    return this.archiveDecider.shouldArchive(
      {
        spacedRepetitionLevel: vocabulary.level,
        writingLevel: this.getNextLevel(vocabulary, feedback, maxLevel),
      },
      autoArchiveSettings
    );
  }

  private getCurrentWritingLevel(vocabulary: Vocabulary): number {
    return typeof vocabulary.writing !== 'undefined'
      ? vocabulary.writing.level
      : 0;
  }
}
