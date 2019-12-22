/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';

import { ForgotPasswordScreenDelegate } from '../../delegates/auth/ForgotPasswordScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ForgotPasswordScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableForgotPasswordScreen
  ): ForgotPasswordScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new ForgotPasswordScreenDelegate(
      this.eventBus,
      observableScreen,
      navigatorDelegate
    );
  }
}
