/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, observable } from 'mobx';

import { ObservableCommandList } from '../animation/ObservableCommandList';
import { ObservableReflexQuestion } from './ObservableReflexQuestion';

export class ObservableReflexGameState {
  @observable
  public started: boolean;

  @observable
  public remainingTime: number;

  @observable
  public waitingForFetching: boolean;

  @observable
  public currentQuestion?: ObservableReflexQuestion;

  @observable
  public timerCommandList = new ObservableCommandList();

  public constructor(
    started: boolean,
    remainingTime: number,
    waitingForFetching: boolean,
    currentQuestion?: ObservableReflexQuestion
  ) {
    this.started = started;
    this.remainingTime = remainingTime;
    this.waitingForFetching = waitingForFetching;
    this.currentQuestion = currentQuestion;
  }

  @action
  public reset(
    started: boolean,
    remainingTime: number,
    waitingForFetching: boolean,
    currentQuestion?: ObservableReflexQuestion
  ): void {
    this.started = started;
    this.remainingTime = remainingTime;
    this.waitingForFetching = waitingForFetching;
    this.currentQuestion = currentQuestion;
  }
}
