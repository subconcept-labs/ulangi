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
import * as _ from 'lodash';

import { ReviewFeedbackDataDelegate } from './ReviewFeedbackDataDelegate';

export class ReviewFeedbackBarDelegate {
  private observer: Observer;
  private reviewFeedbackBarState: ObservableReviewFeedbackBarState;
  private reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate;

  public constructor(
    observer: Observer,
    reviewFeedbackBarState: ObservableReviewFeedbackBarState,
    reviewFeedbackDataDelegate: ReviewFeedbackDataDelegate
  ) {
    this.observer = observer;
    this.reviewFeedbackBarState = reviewFeedbackBarState;
    this.reviewFeedbackDataDelegate = reviewFeedbackDataDelegate;
  }

  public show(vocabulary: Vocabulary): void {
    this.calculateNextReviewData(vocabulary);

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
        callback
      );
    }
  }

  private calculateNextReviewData(vocabulary: Vocabulary): void {
    this.reviewFeedbackBarState.nextReviewByFeedback.replace(
      _.values(Feedback).map(
        (feedback): [Feedback, NextReviewData] => {
          return [
            feedback as Feedback,
            this.reviewFeedbackDataDelegate.calculateNextReviewData(
              vocabulary,
              feedback as Feedback,
              true,
              true
            ),
          ];
        }
      )
    );
  }
}
