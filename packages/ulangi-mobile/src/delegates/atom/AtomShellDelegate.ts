/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { BaseTransformer } from '@ulangi/ulangi-common/core';
import {
  ObservableAtomPlayScreen,
  ObservableShell,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { config } from '../../constants/config';

export class AtomShellDelegate {
  private observableScreen: ObservableAtomPlayScreen;

  public constructor(observableScreen: ObservableAtomPlayScreen) {
    this.observableScreen = observableScreen;
  }

  public getShellByPosition(position: {
    x: number;
    y: number;
  }): ObservableShell | undefined {
    const { x, y } = BaseTransformer.transformBase(
      this.observableScreen.origin.position,
      position
    );
    const centerX = x + config.atom.particleSize / 2;
    const centerY = y - config.atom.particleSize / 2;
    return this.observableScreen.shells.find(
      (shell): boolean => {
        const radius_sq_range = [
          Math.pow(shell.diameter / 2 - config.atom.particleSize / 2, 2),
          Math.pow(shell.diameter / 2 + config.atom.particleSize / 2, 2),
        ];
        return _.inRange(
          Math.pow(centerX, 2) + Math.pow(centerY, 2),
          radius_sq_range[0],
          radius_sq_range[1]
        );
      }
    );
  }

  public highlightShell(
    shellType: 'OUTER' | 'INNER',
    color: 'green' | 'red'
  ): void {
    this.observableScreen.shells.forEach(
      (shell): void => {
        if (shell.shellType === shellType) {
          shell.highlightColor = color;
        }
      }
    );
  }

  public unhighlightShells(): void {
    this.observableScreen.shells.forEach(
      (shell): void => {
        shell.highlightColor = null;
      }
    );
  }
}
