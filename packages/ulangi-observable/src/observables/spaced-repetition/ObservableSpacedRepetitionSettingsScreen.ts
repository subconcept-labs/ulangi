/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReviewStrategy, ScreenName } from '@ulangi/ulangi-common/enums';
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
  public selectedFeedbackButtons: 3 | 4 | 5;

  @observable
  public selectedAutoplayAudio: boolean;

  public constructor(
    selectedInitialInterval: number,
    selectedLimit: number,
    selectedReviewStrategy: ReviewStrategy,
    selectedFeedbackButtons: 3 | 4 | 5,
    selectedAutoplayAudio: boolean,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(screenName, topBar);
    this.selectedInitialInterval = selectedInitialInterval;
    this.selectedLimit = selectedLimit;
    this.selectedReviewStrategy = selectedReviewStrategy;
    this.selectedFeedbackButtons = selectedFeedbackButtons;
    this.selectedAutoplayAudio = selectedAutoplayAudio;
  }
}
