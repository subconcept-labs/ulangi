/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue, ObservableMap, observable } from 'mobx';

import { ObservableReviewActionBarState } from '../review-action/ObservableReviewActionBarState';
import { ObservableFeedbackListState } from '../review-feedback/ObservableFeedbackListState';
import { ObservableReviewFeedbackBarState } from '../review-feedback/ObservableReviewFeedbackBarState';
import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableVocabulary } from '../vocabulary/ObservableVocabulary';
import { ObservableWritingFormState } from './ObservableWritingFormState';
import { ObservableWritingResult } from './ObservableWritingResult';

export class ObservableWritingLessonScreen extends ObservableScreen {
  @observable
  public screenAppearedTimes: number;

  public readonly vocabularyList: ObservableMap<string, ObservableVocabulary>;

  public readonly writingFormState: ObservableWritingFormState;

  public readonly writingResult: ObservableWritingResult;

  public readonly feedbackListState: ObservableFeedbackListState;

  public readonly reviewActionBarState: ObservableReviewActionBarState;

  public readonly reviewFeedbackBarState: ObservableReviewFeedbackBarState;

  public readonly numberOfFeedbackButtons: IObservableValue<3 | 4 | 5>;

  public readonly autoplayAudio: IObservableValue<boolean>;

  public readonly shouldShowResult: IObservableValue<boolean>;

  public readonly shouldShowAdOrGoogleConsentForm: IObservableValue<boolean>;

  public readonly speakState: IObservableValue<ActivityState>;

  public readonly saveState: IObservableValue<ActivityState>;

  public constructor(
    screenAppearedTimes: number,
    vocabularyList: ObservableMap<string, ObservableVocabulary>,
    writingFormState: ObservableWritingFormState,
    writingResult: ObservableWritingResult,
    feedbackListState: ObservableFeedbackListState,
    reviewActionBarState: ObservableReviewActionBarState,
    reviewFeedbackBarState: ObservableReviewFeedbackBarState,
    numberOfFeedbackButtons: IObservableValue<3 | 4 | 5>,
    autoplayAudio: IObservableValue<boolean>,
    shouldShowResult: IObservableValue<boolean>,
    shouldShowAdOrGoogleConsentForm: IObservableValue<boolean>,
    speakState: IObservableValue<ActivityState>,
    saveState: IObservableValue<ActivityState>,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.screenAppearedTimes = screenAppearedTimes;
    this.vocabularyList = vocabularyList;
    this.writingFormState = writingFormState;
    this.writingResult = writingResult;
    this.feedbackListState = feedbackListState;
    this.autoplayAudio = autoplayAudio;
    this.reviewActionBarState = reviewActionBarState;
    this.reviewFeedbackBarState = reviewFeedbackBarState;
    this.numberOfFeedbackButtons = numberOfFeedbackButtons;
    this.shouldShowResult = shouldShowResult;
    this.shouldShowAdOrGoogleConsentForm = shouldShowAdOrGoogleConsentForm;
    this.speakState = speakState;
    this.saveState = saveState;
  }
}
