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
export class ChangeEmailScreenDelegate {
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

  public changeEmail(
    newEmail: string,
    password: string,
    callback: {
      onChangingEmail: () => void;
      onChangeEmailSucceeded: () => void;
      onChangeEmailFailed: (errorBag: ErrorBag) => void;
    },
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__CHANGE_EMAIL, {
        newEmail,
        currentPassword: password,
      }),
      group(
        on(ActionType.USER__CHANGING_EMAIL, callback.onChangingEmail),
        once(
          ActionType.USER__CHANGE_EMAIL_SUCCEEDED,
          callback.onChangeEmailSucceeded,
        ),
        once(
          ActionType.USER__CHANGE_EMAIL_FAILED,
          (errorBag): void => callback.onChangeEmailFailed(errorBag),
        ),
      ),
    );
  }

  public showChangingEmailDialog(): void {
    this.dialogDelegate.show({
      message: 'Changing email. Please wait...',
    });
  }

  public showChangeEmailSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Changed email successfully.',
      onClose: (): void => {
        this.navigatorDelegate.dismissScreen();
      },
    });
  }

  public showChangeEmailFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'SAVE FAILED',
    });
  }
}
