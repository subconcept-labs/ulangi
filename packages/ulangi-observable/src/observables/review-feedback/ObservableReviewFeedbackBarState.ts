/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback } from '@ulangi/ulangi-common/enums';
import { NextReviewData } from '@ulangi/ulangi-common/interfaces';
import { ObservableMap, observable } from 'mobx';

export class ObservableReviewFeedbackBarState {
  public readonly nextReviewByFeedback: ObservableMap<Feedback, NextReviewData>;

  @observable
  public buttonType: null | 'SHOW_ANSWER_BUTTON' | 'FEEDBACK_BUTTONS';

  public constructor(
    nextReviewByFeedback: ObservableMap<Feedback, NextReviewData>,
    buttonType: null | 'SHOW_ANSWER_BUTTON' | 'FEEDBACK_BUTTONS'
  ) {
    this.nextReviewByFeedback = nextReviewByFeedback;
    this.buttonType = buttonType;
  }
}
