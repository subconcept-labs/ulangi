/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ReviewPriority,
  ReviewStrategy,
  ScreenName,
} from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';

export class ObservableSpacedRepetitionSettingsScreen extends ObservableScreen {
  @observable
  public selectedInitialInterval: number;

  @observable
  public selectedLimit: number;

  @observable
  public selectedReviewStrategy: ReviewStrategy;

  @observable
  public selectedReviewPriority: ReviewPriority;

  @observable
  public selectedFeedbackButtons: 3 | 4 | 5;

  @observable
  public selectedAutoplayAudio: boolean;

  public constructor(
    selectedInitialInterval: number,
    selectedLimit: number,
    selectedReviewStrategy: ReviewStrategy,
    selectedReviewPriority: ReviewPriority,
    selectedFeedbackButtons: 3 | 4 | 5,
    selectedAutoplayAudio: boolean,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.selectedInitialInterval = selectedInitialInterval;
    this.selectedLimit = selectedLimit;
    this.selectedReviewStrategy = selectedReviewStrategy;
    this.selectedReviewPriority = selectedReviewPriority;
    this.selectedFeedbackButtons = selectedFeedbackButtons;
    this.selectedAutoplayAudio = selectedAutoplayAudio;
  }
}
