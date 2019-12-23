/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ErrorCode, ScreenName } from '@ulangi/ulangi-common/enums';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { boundClass } from 'autobind-decorator';

import { AuthDelegate } from '../auth/AuthDelegate';
import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class WelcomeScreenDelegate {
  private authDelegate: AuthDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private dialogDelegate: DialogDelegate;
  private analytics: AnalyticsAdapter;

  public constructor(
    authDelegate: AuthDelegate,
    navigatorDelegate: NavigatorDelegate,
    dialogDelegate: DialogDelegate,
    analytics: AnalyticsAdapter,
  ) {
    this.authDelegate = authDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.dialogDelegate = dialogDelegate;
    this.analytics = analytics;
  }

  public signInAsGuest(): void {
    this.analytics.logEvent('sign_in_as_guest');
    this.authDelegate.signInAsGuest({
      onSigningInAsGuest: this.showSigningInAsGuestDialog,
      onSignInAsGuestSucceeded: (): void => {
        this.navigatorDelegate.dismissLightBox();
        this.navigatorDelegate.resetTo(ScreenName.CREATE_FIRST_SET_SCREEN, {});
      },
      onSignInAsGuestFailed: (errorCode): void => {
        if (errorCode === ErrorCode.USER__EMAIL_ALREADY_REGISTERED) {
          this.signInAsGuest();
        } else {
          this.showSigningInAsGuestFailedDialog(errorCode);
        }
      },
    });
  }

  public navigateToSignInScreen(): void {
    this.navigatorDelegate.resetTo(ScreenName.SIGN_IN_SCREEN, {});
  }

  private showSigningInAsGuestDialog(): void {
    this.dialogDelegate.show({
      message: 'Setting up. Please wait...',
    });
  }

  private showSigningInAsGuestFailedDialog(errorCode: string): void {
    this.dialogDelegate.showFailedDialog(errorCode, {
      title: 'FAILED TO SIGN IN AS GUEST',
    });
  }
}
