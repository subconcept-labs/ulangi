/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  SpacedRepetitionScheduler,
  WritingScheduler,
} from '@ulangi/ulangi-common/core';
import { Feedback } from '@ulangi/ulangi-common/enums';
import { NextReviewData, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import * as _ from 'lodash';
import { ObservableMap } from 'mobx';

import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';

export class ReviewFeedbackDataDelegate {
  private readonly maxLevel: number;
  private scheduler: WritingScheduler | SpacedRepetitionScheduler;
  private settingsDelegate:
    | WritingSettingsDelegate
    | SpacedRepetitionSettingsDelegate;
  private autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate;

  public constructor(
    maxLevel: number,
    scheduler: WritingScheduler | SpacedRepetitionScheduler,
    settingsDelegate:
      | WritingSettingsDelegate
      | SpacedRepetitionSettingsDelegate,
    autoArchiveSettingsDelegate: AutoArchiveSettingsDelegate
  ) {
    this.maxLevel = maxLevel;
    this.scheduler = scheduler;
    this.settingsDelegate = settingsDelegate;
    this.autoArchiveSettingsDelegate = autoArchiveSettingsDelegate;
  }

  public createAllNextReviewData(
    vocabularyList: ReadonlyMap<string, Vocabulary>,
    feedbackList: ReadonlyMap<string, Feedback>
  ): ObservableMap<string, NextReviewData> {
    return new ObservableMap(
      Array.from(feedbackList.entries()).map(
        ([vocabularyId, feedback]): [string, NextReviewData] => {
          return [
            vocabularyId,
            this.calculateNextReviewData(
              assertExists(vocabularyList.get(vocabularyId)),
              feedback
            ),
          ];
        }
      )
    );
  }

  public calculateNextReviewData(
    vocabulary: Vocabulary,
    feedback: Feedback,
    shortForm?: boolean,
    withoutSuffix?: boolean
  ): NextReviewData {
    const autoArchiveSettings = this.autoArchiveSettingsDelegate.getCurrentSettings();
    const { initialInterval } = this.settingsDelegate.getCurrentSettings();

    const nextLevel = this.scheduler.getNextLevel(
      vocabulary,
      feedback,
      this.maxLevel
    );

    const nextReviewTimeFromNow = _.upperFirst(
      this.scheduler.getNextReviewTimeFromNow(
        initialInterval,
        vocabulary,
        feedback,
        this.maxLevel,
        autoArchiveSettings,
        shortForm,
        withoutSuffix
      )
    );

    const netLevelChange = this.scheduler.getNetLevelChange(
      vocabulary,
      feedback,
      this.maxLevel
    );

    return {
      nextLevel,
      nextReview: nextReviewTimeFromNow,
      netLevelChange,
    };
  }
}
