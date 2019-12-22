/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SynchronizerScreenDelegate } from '../../delegates/sync/SynchronizerScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SynchronizerScreenFactory extends ScreenFactory {
  public createScreenDelegate(): SynchronizerScreenDelegate {
    return new SynchronizerScreenDelegate(this.eventBus);
  }
}
