/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { isObservableArray, observable } from 'mobx';

import { ObservableElasticScaleCommand } from './ObservableElasticScaleCommand';
import { ObservableMoveToCommand } from './ObservableMoveToCommand';
import { ObservableScaleCommand } from './ObservableScaleCommand';
import { ObservableScaleXCommand } from './ObservableScaleXCommand';
import { ObservableStopAndResetCommand } from './ObservableStopAndResetCommand';
import { ObservableStopCommand } from './ObservableStopCommand';

type PossibleCommand =
  | ObservableMoveToCommand
  | ObservableScaleCommand
  | ObservableElasticScaleCommand
  | ObservableScaleXCommand
  | ObservableStopCommand
  | ObservableStopAndResetCommand;

export class ObservableCommandList {
  @observable
  public readonly commands: PossibleCommand[] = [];

  public constructor(commands?: PossibleCommand[]) {
    if (typeof commands !== 'undefined') {
      this.replace(commands);
    }
  }

  public replace(commands: PossibleCommand[]): void {
    if (isObservableArray(this.commands)) {
      this.commands.replace(commands);
    } else {
      throw new Error('this.commands is not observable');
    }
  }

  public areAllCompleted(): boolean {
    return (
      this.commands.filter(
        (command): boolean => command.state === 'incompleted'
      ).length === 0
    );
  }
}
