/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ChangePasswordScreenDelegate } from '../../delegates/account/ChangePasswordScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ChangePasswordScreenFactory extends ScreenFactory {
  public createScreenDelegate(): ChangePasswordScreenDelegate {
    return new ChangePasswordScreenDelegate(
      this.eventBus,
      this.createNavigatorDelegate()
    );
  }
}
