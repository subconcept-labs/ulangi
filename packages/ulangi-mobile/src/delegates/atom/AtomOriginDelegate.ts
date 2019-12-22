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
import { Dimensions } from 'react-native';

import { config } from '../../constants/config';

export class AtomOriginDelegate {
  private observableScreen: ObservableAtomPlayScreen;

  public constructor(observableScreen: ObservableAtomPlayScreen) {
    this.observableScreen = observableScreen;
  }

  public bounceOrigin(): void {
    this.observableScreen.origin.commandList.commands.push(
      new ObservableElasticScaleCommand(
        { scaleX: 1.5, scaleY: 1.5 },
        { scaleX: 1, scaleY: 1 }
      )
    );
  }

  public getDefaultOriginPosition(): { x: number; y: number } {
    const x = Dimensions.get('window').width / 2;
    const screenHeight = Dimensions.get('window').height;
    const y =
      screenHeight -
      config.atom.bottomOffset -
      config.atom.outerShellDiameter / 2 -
      config.atom.particleSize / 2;
    return { x, y };
  }
}
