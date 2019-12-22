/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SpacedRepetitionScheduler } from '@ulangi/ulangi-common/core';
import { ObservableSpacedRepetitionLessonScreen } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { AdAfterLessonDelegate } from '../../delegates/ad/AdAfterLessonDelegate';
import { AdDelegate } from '../../delegates/ad/AdDelegate';
import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { ReviewFeedbackBarDelegate } from '../../delegates/review-feedback/ReviewFeedbackBarDelegate';
import { ReviewFeedbackDataDelegate } from '../../delegates/review-feedback/ReviewFeedbackDataDelegate';
import { SpacedRepetitionLessonScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionLessonScreenDelegate';
import { SpacedRepetitionSaveResultDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSaveResultDelegate';
import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { SpeakDelegate } from '../../delegates/vocabulary/SpeakDelegate';
import { ReviewIterator } from '../../iterators/ReviewIterator';
import { ScreenFactory } from '../ScreenFactory';

export class SpacedRepetitionLessonScreenFactory extends ScreenFactory {
  public createSpacedRepetitionSettingsDelegate(): SpacedRepetitionSettingsDelegate {
    return new SpacedRepetitionSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableSpacedRepetitionLessonScreen,
    reviewIterator: ReviewIterator,
    startLesson: () => void
  ): SpacedRepetitionLessonScreenDelegate {
    const spacedRepetitionScheduler = new SpacedRepetitionScheduler();

    const navigatorDelegate = this.createNavigatorDelegate();

    const spacedRepetitionSettingsDelegate = this.createSpacedRepetitionSettingsDelegate();

    const autoArchiveSettingsDelegate = new AutoArchiveSettingsDelegate(
      this.props.rootStore.userStore
    );

    const saveResultDelegate = new SpacedRepetitionSaveResultDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen.vocabularyList,
      observableScreen.feedbackListState.feedbackList,
      autoArchiveSettingsDelegate
    );

    const speakDelegate = new SpeakDelegate(
      this.eventBus,
      this.props.rootStore.audioStore
    );

    const reviewFeedbackDataDelegate = new ReviewFeedbackDataDelegate(
      config.spacedRepetition.maxLevel,
      spacedRepetitionScheduler,
      spacedRepetitionSettingsDelegate,
      autoArchiveSettingsDelegate
    );

    const reviewFeedbackBarDelegate = new ReviewFeedbackBarDelegate(
      this.observer,
      observableScreen.reviewFeedbackBarState,
      reviewFeedbackDataDelegate
    );

    const adDelegate = new AdDelegate(
      this.eventBus,
      this.props.rootStore.adStore,
      this.props.rootStore.userStore,
      this.props.rootStore.remoteConfigStore
    );

    const adAfterLessonDelegate = new AdAfterLessonDelegate(
      this.observer,
      observableScreen.shouldShowAdOrGoogleConsentForm,
      navigatorDelegate
    );

    return new SpacedRepetitionLessonScreenDelegate(
      this.observer,
      this.props.rootStore.setStore,
      observableScreen,
      reviewIterator,
      reviewFeedbackBarDelegate,
      saveResultDelegate,
      speakDelegate,
      adDelegate,
      adAfterLessonDelegate,
      navigatorDelegate,
      startLesson
    );
  }
}
