/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { NextReviewData } from '@ulangi/ulangi-common/interfaces';
import { ObservableMap } from 'mobx';

import { ObservableFeedbackListState } from '../review-feedback/ObservableFeedbackListState';
import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableVocabulary } from '../vocabulary/ObservableVocabulary';

export class ObservableReviewFeedbackScreen extends ObservableScreen {
  public readonly vocabularyList: ObservableMap<string, ObservableVocabulary>;

  public readonly feedbackListState: ObservableFeedbackListState;

  public readonly allNextReviewData: ObservableMap<string, NextReviewData>;

  public constructor(
    vocabularyList: ObservableMap<string, ObservableVocabulary>,
    feedbackListState: ObservableFeedbackListState,
    allNextReviewData: ObservableMap<string, NextReviewData>,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.vocabularyList = vocabularyList;
    this.feedbackListState = feedbackListState;
    this.allNextReviewData = allNextReviewData;
  }
}
