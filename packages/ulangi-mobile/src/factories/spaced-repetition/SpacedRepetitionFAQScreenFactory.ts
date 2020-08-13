/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SpacedRepetitionFAQScreenDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionFAQScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SpacedRepetitionFAQScreenFactory extends ScreenFactory {
  public createScreenDelegate(): SpacedRepetitionFAQScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new SpacedRepetitionFAQScreenDelegate(navigatorDelegate);
  }
}
