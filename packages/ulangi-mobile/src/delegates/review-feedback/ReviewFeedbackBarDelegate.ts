/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback } from '@ulangi/ulangi-common/enums';
import { NextReviewData, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservableReviewFeedbackBarState } from '@ulangi/ulangi-observable';

import { ReviewFeedbackButtonDelegate } from './ReviewFeedbackButtonDelegate';
import { ReviewFeedbackDataDelegate } from './ReviewFeedbackDataDelegate';

export class ReviewFeedbackBarDelegate {
  private reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  private reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate;
  private reviewFeedbackButtonDelegate: ReviewFeedbackButtonDelegate;

  public constructor(
    reviewFeedbackBarState: ObservableReviewFeedbackBarState,
    reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate,
    reviewFeedbackButtonDelegate: ReviewFeedbackButtonDelegate,
  ) {
    this.reviewFeedbackBarState = reviewFeedbackBarState;
    this.reviewFeedbackDataDelegate = reviewFeedbackDataDelegate;
    this.reviewFeedbackButtonDelegate = reviewFeedbackButtonDelegate;
  }

  public showShowAnswerButton(): void {
    this.reviewFeedbackBarState.buttonType = 'SHOW_ANSWER_BUTTON';
  }

  public showFeedbackButtons(
    vocabulary: Vocabulary,
    numberOfFeedbackButtons: 3 | 4 | 5,
  ): void {
    this.calculateNextReviewData(vocabulary, numberOfFeedbackButtons);

    this.reviewFeedbackBarState.buttonType = 'FEEDBACK_BUTTONS';
  }

  public hide(): void {
    this.reviewFeedbackBarState.buttonType = null;
  }

  private calculateNextReviewData(
    vocabulary: Vocabulary,
    numberOfFeedbackButtons: 3 | 4 | 5,
  ): void {
    this.reviewFeedbackBarState.nextReviewByFeedback.replace(
      this.reviewFeedbackButtonDelegate
        .getButtonsToShow(numberOfFeedbackButtons)
        .map(
          (feedback): [Feedback, NextReviewData] => {
            return [
              feedback as Feedback,
              this.reviewFeedbackDataDelegate.calculateNextReviewData(
                vocabulary,
                feedback as Feedback,
                true,
                true,
              ),
            ];
          },
        ),
    );
  }
}
