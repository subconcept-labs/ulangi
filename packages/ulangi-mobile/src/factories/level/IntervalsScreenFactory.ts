/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IntervalsScreenDelegate } from '../../delegates/level/IntervalsScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class IntervalsScreenFactory extends ScreenFactory {
  public createScreenDelegate(): IntervalsScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new IntervalsScreenDelegate(navigatorDelegate);
  }
}
