/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSetUpAccountScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { config } from '../../constants/config';
import { DialogDelegate } from '../../delegates/dialog/DialogDelegate';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';

@boundClass
export class SetUpAccountScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableSetUpAccountScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableSetUpAccountScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public submit(): void {
    Keyboard.dismiss();
    this.eventBus.pubsub(
      createAction(ActionType.USER__CHANGE_EMAIL_AND_PASSWORD, {
        newEmail: this.observableScreen.email,
        newPassword: this.observableScreen.password,
        confirmPassword: this.observableScreen.confirmPassword,
        currentPassword: config.general.guestPassword,
      }),
      group(
        on(
          ActionType.USER__CHANGING_EMAIL_AND_PASSWORD,
          this.showSettingUpAccountDialog
        ),
        once(
          ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_SUCCEEDED,
          (): void => {
            this.showSetUpAccountSucceededDialog();
          }
        ),
        once(
          ActionType.USER__CHANGE_EMAIL_AND_PASSWORD_FAILED,
          ({ errorCode }): void => {
            this.showSetUpAccountFailedDialog(errorCode);
          }
        )
      )
    );
  }

  private showSettingUpAccountDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Setting up account. Please wait...',
    });
  }

  private showSetUpAccountSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Account set up successully.',
      onClose: (): void => {
        this.navigatorDelegate.pop();
      },
    });
  }

  private showSetUpAccountFailedDialog(errorCode: string): void {
    this.dialogDelegate.showFailedDialog(errorCode, {
      title: 'SET UP ACCOUNT FAILED',
    });
  }
}
