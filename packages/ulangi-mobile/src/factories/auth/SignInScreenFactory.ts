/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSignInScreen } from '@ulangi/ulangi-observable';

import { AuthDelegate } from '../../delegates/auth/AuthDelegate';
import { SignInScreenDelegate } from '../../delegates/auth/SignInScreenDelegate';
import { FetchSetDelegate } from '../../delegates/set/FetchSetDelegate';
import { SetListDelegate } from '../../delegates/set/SetListDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SignInScreenFactory extends ScreenFactory {
  public createSignInScreenDelegate(
    observableScreen: ObservableSignInScreen,
  ): SignInScreenDelegate {
    const rootScreenDelegate = this.createRootScreenDelegate();

    const navigatorDelegate = this.createNavigatorDelegate();

    const authDelegate = new AuthDelegate(this.eventBus);

    const setListDelegate = new SetListDelegate(this.eventBus);

    const fetchSetDelegate = new FetchSetDelegate(this.eventBus);

    return new SignInScreenDelegate(
      this.eventBus,
      this.observer,
      this.props.observableKeyboard,
      observableScreen,
      authDelegate,
      setListDelegate,
      fetchSetDelegate,
      rootScreenDelegate,
      navigatorDelegate,
      this.props.analytics,
    );
  }
}
