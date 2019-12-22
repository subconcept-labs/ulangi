/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableReflexScreen,
  ObservableScaleXCommand,
  ObservableStopAndResetCommand,
  ObservableStopCommand,
  Observer,
} from '@ulangi/ulangi-observable';

import { config } from '../../constants/config';

export class TimerDelegate {
  private observer: Observer;
  public observableScreen: ObservableReflexScreen;

  public constructor(
    observer: Observer,
    observableScreen: ObservableReflexScreen
  ) {
    this.observer = observer;
    this.observableScreen = observableScreen;
  }

  public startTimer(callback: { onTimeUp: () => void }): void {
    const timerCommand = new ObservableScaleXCommand(
      0,
      this.observableScreen.gameState.remainingTime
    );
    this.observableScreen.gameState.timerCommandList.commands.push(
      timerCommand
    );

    this.observer.when(
      (): boolean => timerCommand.state === 'completed',
      callback.onTimeUp
    );
  }

  public stopTimer(): void {
    this.observableScreen.gameState.timerCommandList.commands.push(
      new ObservableStopCommand()
    );
  }

  public stopAndResetTimer(): void {
    this.observableScreen.gameState.remainingTime =
      config.reflex.timePerQuestion;
    this.observableScreen.gameState.timerCommandList.commands.push(
      new ObservableStopAndResetCommand()
    );
  }
}
