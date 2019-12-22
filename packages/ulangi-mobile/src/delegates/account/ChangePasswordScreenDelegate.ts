/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { boundClass } from 'autobind-decorator';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class ChangePasswordScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(eventBus: EventBus, navigatorDelegate: NavigatorDelegate) {
    this.eventBus = eventBus;
    this.navigatorDelegate = navigatorDelegate;
  }

  public changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    callback: {
      onChangingPassword: () => void;
      onChangePasswordSucceeded: () => void;
      onChangePasswordFailed: (errorCode: string) => void;
    }
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      }),
      group(
        on(ActionType.USER__CHANGING_PASSWORD, callback.onChangingPassword),
        once(
          ActionType.USER__CHANGE_PASSWORD_SUCCEEDED,
          callback.onChangePasswordSucceeded
        ),
        once(
          ActionType.USER__CHANGE_PASSWORD_FAILED,
          ({ errorCode }): void => callback.onChangePasswordFailed(errorCode)
        )
      )
    );
  }

  public showChangingPasswordDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Changing password. Please wait...',
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showChangePasswordSucceededDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message: 'Changed password successfully.',
        showCloseButton: true,
        closeOnTouchOutside: true,
        onClose: (): void => {
          this.navigatorDelegate.pop();
        },
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public showChangePasswordFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        title: 'SAVE FAILED',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }
}
