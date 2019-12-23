/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ChangeEmailScreenDelegate } from '../../delegates/account/ChangeEmailScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ChangeEmailScreenFactory extends ScreenFactory {
  public createScreenDelegate(): ChangeEmailScreenDelegate {
    return new ChangeEmailScreenDelegate(
      this.eventBus,
      this.createNavigatorDelegate(),
    );
  }
}
