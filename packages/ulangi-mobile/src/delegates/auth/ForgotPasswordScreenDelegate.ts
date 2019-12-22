/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class ForgotPasswordScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private observableScreen: ObservableForgotPasswordScreen;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableForgotPasswordScreen,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
  }

  public requestResetPasswordEmail(): void {
    Keyboard.dismiss();
    this.eventBus.pubsub(
      createAction(ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL, {
        email: this.observableScreen.email.get(),
      }),
      group(
        on(
          ActionType.USER__REQUESTING_PASSWORD_RESET_EMAIL,
          this.showRequestingDialog
        ),
        once(
          ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL_SUCCEEDED,
          this.showRequestSucceededDialog
        ),
        once(
          ActionType.USER__REQUEST_PASSWORD_RESET_EMAIL_FAILED,
          ({ errorCode }): void => this.showRequestFailedDialog(errorCode)
        )
      )
    );
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }

  private showRequestingDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Requesting reset password link. Please wait...',
      },
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showRequestSucceededDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message: 'The reset password link has been sent to your email.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  private showRequestFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'REQUEST FAILED',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }
}
