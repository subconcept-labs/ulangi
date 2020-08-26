/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WritingScheduler } from '@ulangi/ulangi-common/core';
import { ReviewPriority } from '@ulangi/ulangi-common/enums';
import { ObservableWritingLessonScreen } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { AdAfterLessonDelegate } from '../../delegates/ad/AdAfterLessonDelegate';
import { AdDelegate } from '../../delegates/ad/AdDelegate';
import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { InAppRatingDelegate } from '../../delegates/rating/InAppRatingDelegate';
import { ReviewActionMenuDelegate } from '../../delegates/review-action/ReviewActionMenuDelegate';
import { ReviewFeedbackBarDelegate } from '../../delegates/review-feedback/ReviewFeedbackBarDelegate';
import { ReviewFeedbackButtonDelegate } from '../../delegates/review-feedback/ReviewFeedbackButtonDelegate';
import { ReviewFeedbackDataDelegate } from '../../delegates/review-feedback/ReviewFeedbackDataDelegate';
import { SpeakDelegate } from '../../delegates/vocabulary/SpeakDelegate';
import { WritingCountsDelegate } from '../../delegates/writing/WritingCountsDelegate';
import { WritingFormDelegate } from '../../delegates/writing/WritingFormDelegate';
import { WritingLessonScreenDelegate } from '../../delegates/writing/WritingLessonScreenDelegate';
import { WritingSaveResultDelegate } from '../../delegates/writing/WritingSaveResultDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';
import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { LessonScreenStyle } from '../../styles/LessonScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class WritingLessonScreenFactory extends ScreenFactory {
  public createWritingSettingsDelegate(): WritingSettingsDelegate {
    return new WritingSettingsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableWritingLessonScreen,
    questionIterator: WritingQuestionIterator,
    currentCategoryNames: undefined | readonly string[],
    startLesson: (overrideReviewPriority: undefined | ReviewPriority) => void,
  ): WritingLessonScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const adDelegate = new AdDelegate(
      this.eventBus,
      this.props.rootStore.adStore,
      this.props.rootStore.userStore,
      this.props.rootStore.remoteConfigStore,
    );

    const adAfterLessonDelegate = new AdAfterLessonDelegate(
      this.observer,
      observableScreen.shouldShowAdOrGoogleConsentForm,
      navigatorDelegate,
    );

    const inAppRatingDelegate = new InAppRatingDelegate(
      this.eventBus,
      this.props.rootStore.userStore,
      this.props.rootStore.networkStore,
      this.props.rootStore.remoteConfigStore,
      dialogDelegate,
    );

    const autoArchiveSettingsDelegate = new AutoArchiveSettingsDelegate(
      this.props.rootStore.userStore,
    );

    const saveResultDelegate = new WritingSaveResultDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      observableScreen.vocabularyList,
      observableScreen.feedbackListState.feedbackList,
      autoArchiveSettingsDelegate,
    );

    const writingScheduler = new WritingScheduler();

    const writingFormDelegate = new WritingFormDelegate(
      this.observer,
      observableScreen.writingFormState,
      observableScreen.writingResult,
    );

    const writingSettingsDelegate = this.createWritingSettingsDelegate();

    const countsDelegate = new WritingCountsDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      writingSettingsDelegate,
    );

    const reviewActionMenuDelegate = new ReviewActionMenuDelegate(
      this.eventBus,
      this.props.observableLightBox,
      navigatorDelegate,
      LessonScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const reviewFeedbackDataDelegate = new ReviewFeedbackDataDelegate(
      config.writing.maxLevel,
      writingScheduler,
      writingSettingsDelegate,
      autoArchiveSettingsDelegate,
    );

    const reviewFeedbackButtonDelegate = new ReviewFeedbackButtonDelegate();

    const reviewFeedbackBarDelegate = new ReviewFeedbackBarDelegate(
      observableScreen.reviewFeedbackBarState,
      reviewFeedbackDataDelegate,
      reviewFeedbackButtonDelegate,
    );

    const speakDelegate = new SpeakDelegate(this.eventBus);

    return new WritingLessonScreenDelegate(
      this.observer,
      this.props.observableConverter,
      this.props.rootStore.setStore,
      observableScreen,
      questionIterator,
      saveResultDelegate,
      countsDelegate,
      writingFormDelegate,
      reviewFeedbackBarDelegate,
      speakDelegate,
      adDelegate,
      adAfterLessonDelegate,
      inAppRatingDelegate,
      reviewActionMenuDelegate,
      dialogDelegate,
      navigatorDelegate,
      currentCategoryNames,
      startLesson,
    );
  }
}
