/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableAtomPlayScreen,
  ObservableElasticScaleCommand,
} from '@ulangi/ulangi-observable';

export class AtomOriginDelegate {
  private observableScreen: ObservableAtomPlayScreen;

  public constructor(observableScreen: ObservableAtomPlayScreen) {
    this.observableScreen = observableScreen;
  }

  public bounceOrigin(): void {
    this.observableScreen.origin.commandList.commands.push(
      new ObservableElasticScaleCommand(
        { scaleX: 1.5, scaleY: 1.5 },
        { scaleX: 1, scaleY: 1 },
      ),
    );
  }
}
