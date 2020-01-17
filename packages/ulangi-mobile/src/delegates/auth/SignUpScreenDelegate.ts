/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSignUpScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class SignUpScreenDelegate {
  private eventBus: EventBus;
  private observableScreen: ObservableSignUpScreen;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableSignUpScreen,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public signUp(): void {
    Keyboard.dismiss();
    this.eventBus.pubsub(
      createAction(ActionType.USER__SIGN_UP, {
        email: this.observableScreen.email.get(),
        password: this.observableScreen.password.get(),
        confirmPassword: this.observableScreen.confirmPassword.get(),
      }),
      group(
        on(ActionType.USER__SIGNING_UP, this.showCreatingAccountDialog),
        once(
          ActionType.USER__SIGN_UP_SUCCEEDED,
          (): void => {
            this.navigatorDelegate.dismissLightBox();
            this.navigatorDelegate.resetTo(
              ScreenName.CREATE_FIRST_SET_SCREEN,
              {},
            );
          },
        ),
        once(
          ActionType.USER__SIGN_UP_FAILED,
          (errorBag): void => this.showSignUpFailedDialog(errorBag),
        ),
      ),
    );
  }

  public showCreatingAccountDialog(): void {
    this.dialogDelegate.show({
      message: 'Creating account. Please wait...',
    });
  }

  public showSignUpFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag);
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }
}
