/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { AuthDelegate } from '@ulangi/ulangi-delegate';

import { WelcomeScreenDelegate } from '../../delegates/welcome/WelcomeScreenDelegate';
import { SingleScreenStyle } from '../../styles/SingleScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class WelcomeScreenFactory extends ScreenFactory {
  public createScreenDelegate(): WelcomeScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      SingleScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );

    const authDelegate = new AuthDelegate(this.eventBus);

    return new WelcomeScreenDelegate(
      authDelegate,
      navigatorDelegate,
      dialogDelegate,
    );
  }
}
