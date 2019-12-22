/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class SecurityScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
  }

  public navigateToChangeEmailScreen(): void {
    this.navigatorDelegate.push(ScreenName.CHANGE_EMAIL_SCREEN, {});
  }

  public navigateToChangePasswordScreen(): void {
    this.navigatorDelegate.push(ScreenName.CHANGE_PASSWORD_SCREEN, {});
  }
}
