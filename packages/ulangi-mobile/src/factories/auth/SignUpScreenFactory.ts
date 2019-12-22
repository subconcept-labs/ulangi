/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSignUpScreen } from '@ulangi/ulangi-observable';

import { SignUpScreenDelegate } from '../../delegates/auth/SignUpScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SignUpScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableSignUpScreen
  ): SignUpScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new SignUpScreenDelegate(
      this.eventBus,
      observableScreen,
      navigatorDelegate
    );
  }
}
