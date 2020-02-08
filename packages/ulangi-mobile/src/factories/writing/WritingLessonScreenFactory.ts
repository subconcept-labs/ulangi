/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WritingScheduler } from '@ulangi/ulangi-common/core';
import { ObservableWritingLessonScreen } from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';
import { AdAfterLessonDelegate } from '../../delegates/ad/AdAfterLessonDelegate';
import { AdDelegate } from '../../delegates/ad/AdDelegate';
import { AutoArchiveSettingsDelegate } from '../../delegates/auto-archive/AutoArchiveSettingsDelegate';
import { ReviewFeedbackBarDelegate } from '../../delegates/review-feedback/ReviewFeedbackBarDelegate';
import { ReviewFeedbackButtonDelegate } from '../../delegates/review-feedback/ReviewFeedbackButtonDelegate';
import { ReviewFeedbackDataDelegate } from '../../delegates/review-feedback/ReviewFeedbackDataDelegate';
import { SpeakDelegate } from '../../delegates/vocabulary/SpeakDelegate';
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
    startLesson: () => void,
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

    const autoArchiveSettingsDelegate = new AutoArchiveSettingsDelegate(
      this.props.rootStore.userStore,
    );

    const saveResultDelegate = new WritingSaveResultDelegate(
      this.eventBus,
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
      this.eventBus,
      this.observer,
      this.props.observableKeyboard,
      this.props.observableConverter,
      this.props.rootStore.setStore,
      observableScreen,
      questionIterator,
      saveResultDelegate,
      writingFormDelegate,
      reviewFeedbackBarDelegate,
      speakDelegate,
      adDelegate,
      adAfterLessonDelegate,
      dialogDelegate,
      navigatorDelegate,
      startLesson,
    );
  }
}
