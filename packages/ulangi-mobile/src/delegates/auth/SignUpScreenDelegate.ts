/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { ObservableSignUpScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class SignUpScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private observableScreen: ObservableSignUpScreen;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    observableScreen: ObservableSignUpScreen,
    navigatorDelegate: NavigatorDelegate
  ) {
    this.eventBus = eventBus;
    this.observableScreen = observableScreen;
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
              {}
            );
          }
        ),
        once(
          ActionType.USER__SIGN_UP_FAILED,
          ({ errorCode }): void => this.showSignUpFailedDialog(errorCode)
        )
      )
    );
  }

  public showCreatingAccountDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Creating account. Please wait...',
      },
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showSignUpFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        title: 'SIGN-UP FAILED',
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public back(): void {
    this.navigatorDelegate.pop();
  }
}
