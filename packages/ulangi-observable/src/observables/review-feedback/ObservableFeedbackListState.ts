/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Feedback } from '@ulangi/ulangi-common/enums';
import { ObservableMap, computed } from 'mobx';

export class ObservableFeedbackListState {
  public readonly feedbackList: ObservableMap<string, Feedback>;

  @computed
  public get numOfPoor(): number {
    return Array.from(this.feedbackList.values()).filter(
      (feedback): boolean => feedback === Feedback.POOR
    ).length;
  }

  @computed
  public get numOfFair(): number {
    return Array.from(this.feedbackList.values()).filter(
      (feedback): boolean => feedback === Feedback.FAIR
    ).length;
  }

  @computed
  public get numOfGood(): number {
    return Array.from(this.feedbackList.values()).filter(
      (feedback): boolean => feedback === Feedback.GOOD
    ).length;
  }

  @computed
  public get numOfGreat(): number {
    return Array.from(this.feedbackList.values()).filter(
      (feedback): boolean => feedback === Feedback.GREAT
    ).length;
  }

  @computed
  public get numOfSuperb(): number {
    return Array.from(this.feedbackList.values()).filter(
      (feedback): boolean => feedback === Feedback.SUPERB
    ).length;
  }

  public constructor(feedbackList: ObservableMap<string, Feedback>) {
    this.feedbackList = feedbackList;
  }
}
