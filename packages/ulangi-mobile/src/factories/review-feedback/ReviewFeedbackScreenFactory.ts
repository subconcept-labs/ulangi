/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  SpacedRepetitionScheduler,
  WritingScheduler,
} from '@ulangi/ulangi-common/core';
import { ObservableReviewFeedbackScreen } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { FeedbackSelectionMenuDelegate } from '../../delegates/review-feedback/FeedbackSelectionMenuDelegate';
import { ReviewFeedbackDataDelegate } from '../../delegates/review-feedback/ReviewFeedbackDataDelegate';
import { ReviewFeedbackScreenDelegate } from '../../delegates/review-feedback/ReviewFeedbackScreenDelegate';
import { SpacedRepetitionSaveResultDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSaveResultDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { WritingSaveResultDelegate } from '../../delegates/writing/WritingSaveResultDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class ReviewFeedbackScreenFactory extends ScreenFactory {
  public createReviewFeedbackDataDelegate(
    lessonType: 'spaced-repetition' | 'writing'
  ): ReviewFeedbackDataDelegate {
    const autoArchiveSettingsDelegate = new AutoArchiveSettingsDelegate(
      this.props.rootStore.userStore
    );

    const scheduler =
      lessonType === 'spaced-repetition'
        ? new SpacedRepetitionScheduler()
        : new WritingScheduler();

    const settingsDelegate =
      lessonType === 'spaced-repetition'
        ? new SpacedRepetitionSettingsDelegate(
            this.eventBus,
            this.props.rootStore.setStore
          )
        : new WritingSettingsDelegate(
            this.eventBus,
            this.props.rootStore.setStore
          );

    const maxLevel =
      lessonType === 'spaced-repetition'
        ? config.spacedRepetition.maxLevel
        : config.writing.maxLevel;

    return new ReviewFeedbackDataDelegate(
      maxLevel,
      scheduler,
      settingsDelegate,
      autoArchiveSettingsDelegate
    );
  }

  public createScreenDelegate(
    lessonType: 'spaced-repetition' | 'writing',
    observableScreen: ObservableReviewFeedbackScreen
  ): ReviewFeedbackScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const feedbackSelectionMenuDelegate = new FeedbackSelectionMenuDelegate(
      navigatorDelegate,
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const autoArchiveSettingsDelegate = new AutoArchiveSettingsDelegate(
      this.props.rootStore.userStore
    );

    const saveResultDelegate =
      lessonType === 'spaced-repetition'
        ? new SpacedRepetitionSaveResultDelegate(
            this.eventBus,
            this.props.rootStore.setStore,
            observableScreen.vocabularyList,
            observableScreen.feedbackListState.feedbackList,
            autoArchiveSettingsDelegate
          )
        : new WritingSaveResultDelegate(
            this.eventBus,
            this.props.rootStore.setStore,
            observableScreen.vocabularyList,
            observableScreen.feedbackListState.feedbackList,
            autoArchiveSettingsDelegate
          );

    const reviewFeedbackDataDelegate = this.createReviewFeedbackDataDelegate(
      lessonType
    );

    return new ReviewFeedbackScreenDelegate(
      observableScreen,
      saveResultDelegate,
      feedbackSelectionMenuDelegate,
      reviewFeedbackDataDelegate,
      dialogDelegate,
      navigatorDelegate
    );
  }
}
