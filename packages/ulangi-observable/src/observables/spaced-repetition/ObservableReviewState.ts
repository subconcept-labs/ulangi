/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ReviewStrategy } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';

import { ObservableVocabulary } from '../vocabulary/ObservableVocabulary';

export class ObservableReviewState {
  @observable
  public reviewStrategy: ReviewStrategy;

  @observable
  public vocabulary: ObservableVocabulary;

  @observable
  public shouldShowAnswer: boolean;

  @observable
  public currentIndex: number;

  @observable
  public total: number;

  @observable
  public shouldRunFadeOutAnimation: boolean;

  @computed
  public get currentQuestionType(): 'forward' | 'reversed' {
    let questionType: 'forward' | 'reversed' = 'forward';

    switch (this.reviewStrategy) {
      case ReviewStrategy.FORWARD:
        questionType = 'forward';
        break;

      case ReviewStrategy.REVERSED:
        questionType = 'reversed';
        break;

      case ReviewStrategy.HALF_AND_HALF:
        if (_.inRange(this.vocabulary.level, 0, 5)) {
          questionType = 'forward';
        } else if (_.inRange(this.vocabulary.level, 5, 10)) {
          questionType = 'reversed';
        }
        break;

      case ReviewStrategy.ALTERNATING:
        if (this.vocabulary.level === 0) {
          questionType = 'forward';
        } else if (_.inRange(this.vocabulary.level, 1, 4)) {
          questionType = 'reversed';
        } else if (_.inRange(this.vocabulary.level, 4, 7)) {
          questionType = 'forward';
        } else if (_.inRange(this.vocabulary.level, 7, 10)) {
          questionType = 'reversed';
        }

        break;
    }

    return questionType;
  }

  @computed
  public get hasNext(): boolean {
    return this.currentIndex + 1 < this.total;
  }

  @computed
  public get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  @action
  public setUpNextItem(vocabulary: ObservableVocabulary): void {
    this.vocabulary = vocabulary;
    this.shouldShowAnswer = false;
    this.currentIndex += 1;
  }

  @action
  public setUpPreviousItem(vocabulary: ObservableVocabulary): void {
    this.vocabulary = vocabulary;
    this.shouldShowAnswer = false;
    this.currentIndex -= 1;
  }

  public constructor(
    reviewStrategy: ReviewStrategy,
    vocabulary: ObservableVocabulary,
    shouldShowAnswer: boolean,
    currentIndex: number,
    total: number,
    shouldRunFadeOutAnimation: boolean
  ) {
    this.reviewStrategy = reviewStrategy;
    this.vocabulary = vocabulary;
    this.shouldShowAnswer = shouldShowAnswer;
    this.currentIndex = currentIndex;
    this.total = total;
    this.shouldRunFadeOutAnimation = shouldRunFadeOutAnimation;
  }
}
