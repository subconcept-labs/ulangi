/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, computed, observable } from 'mobx';

import { ObservableVocabulary } from '../vocabulary/ObservableVocabulary';

export class ObservableReviewState {
  @observable
  public vocabulary: ObservableVocabulary;

  @observable
  public shouldShowDefinitions: boolean;

  @observable
  public currentIndex: number;

  @observable
  public total: number;

  @observable
  public shouldRunFadeOutAnimation: boolean;

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
    this.shouldShowDefinitions = false;
    this.currentIndex += 1;
  }

  @action
  public setUpPreviousItem(vocabulary: ObservableVocabulary): void {
    this.vocabulary = vocabulary;
    this.shouldShowDefinitions = false;
    this.currentIndex -= 1;
  }

  public constructor(
    vocabulary: ObservableVocabulary,
    shouldShowDefinitions: boolean,
    currentIndex: number,
    total: number,
    shouldRunFadeOutAnimation: boolean
  ) {
    this.vocabulary = vocabulary;
    this.shouldShowDefinitions = shouldShowDefinitions;
    this.currentIndex = currentIndex;
    this.total = total;
    this.shouldRunFadeOutAnimation = shouldRunFadeOutAnimation;
  }
}
