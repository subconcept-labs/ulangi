/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback } from '@ulangi/ulangi-common/enums';
import { NextReviewData, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableReviewFeedbackBarState,
  Observer,
} from '@ulangi/ulangi-observable';

import { ReviewFeedbackButtonDelegate } from './ReviewFeedbackButtonDelegate';
import { ReviewFeedbackDataDelegate } from './ReviewFeedbackDataDelegate';

export class ReviewFeedbackBarDelegate {
  private observer: Observer;
  private reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  private reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate;
  private reviewFeedbackButtonDelegate: ReviewFeedbackButtonDelegate;

  public constructor(
    observer: Observer,
    reviewFeedbackBarState: ObservableReviewFeedbackBarState,
    reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate,
    reviewFeedbackButtonDelegate: ReviewFeedbackButtonDelegate,
  ) {
    this.observer = observer;
    this.reviewFeedbackBarState = reviewFeedbackBarState;
    this.reviewFeedbackDataDelegate = reviewFeedbackDataDelegate;
    this.reviewFeedbackButtonDelegate = reviewFeedbackButtonDelegate;
  }

  public show(
    vocabulary: Vocabulary,
    numberOfFeedbackButtons: 3 | 4 | 5,
  ): void {
    this.calculateNextReviewData(vocabulary, numberOfFeedbackButtons);

    if (this.reviewFeedbackBarState.shouldShow === false) {
      this.reviewFeedbackBarState.shouldShow = true;
    }
  }

  public hide(callback: () => void): void {
    // Avoid calling hide multiple times
    if (
      this.reviewFeedbackBarState.shouldShow === true &&
      this.reviewFeedbackBarState.shouldRunCloseAnimation === false
    ) {
      this.reviewFeedbackBarState.shouldRunCloseAnimation = true;
      this.observer.when(
        (): boolean => this.reviewFeedbackBarState.shouldShow === false,
        callback,
      );
    }
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
