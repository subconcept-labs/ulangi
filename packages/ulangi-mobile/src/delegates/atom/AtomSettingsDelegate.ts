/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Dimensions } from 'react-native';

import { config } from '../../constants/config';

export class AtomSettingsDelegate {
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
