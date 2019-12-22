/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { LevelBreakdownScreenDelegate } from '../../delegates/level/LevelBreakdownScreenDelegate';
import { ScreenFactory } from '../../factories/ScreenFactory';

export class LevelBreakdownScreenFactory extends ScreenFactory {
  public createScreenDelegate(): LevelBreakdownScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new LevelBreakdownScreenDelegate(navigatorDelegate);
  }
}
