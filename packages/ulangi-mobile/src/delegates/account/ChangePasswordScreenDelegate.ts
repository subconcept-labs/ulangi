/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import { boundClass } from 'autobind-decorator';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class ChangePasswordScreenDelegate {
  private eventBus: EventBus;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    callback: {
      onChangingPassword: () => void;
      onChangePasswordSucceeded: () => void;
      onChangePasswordFailed: (errorBag: ErrorBag) => void;
    },
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
          callback.onChangePasswordSucceeded,
        ),
        once(
          ActionType.USER__CHANGE_PASSWORD_FAILED,
          (errorBag): void => callback.onChangePasswordFailed(errorBag),
        ),
      ),
    );
  }

  public showChangingPasswordDialog(): void {
    this.dialogDelegate.show({
      message: 'Changing password. Please wait...',
    });
  }

  public showChangePasswordSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Changed password successfully.',
      onClose: (): void => {
        this.navigatorDelegate.pop();
      },
    });
  }

  public showChangePasswordFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'SAVE FAILED',
    });
  }
}
