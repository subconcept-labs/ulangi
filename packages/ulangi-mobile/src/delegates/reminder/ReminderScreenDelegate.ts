/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorCode, UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableNotificationStore,
  ObservableReminderScreen,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';

import { DialogDelegate } from '../dialog/DialogDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { ReminderDelegate } from './ReminderDelegate';

@boundClass
export class ReminderScreenDelegate {
  private eventBus: EventBus;
  private notificationStore: ObservableNotificationStore;
  private observableScreen: ObservableReminderScreen;
  private reminderDelegate: ReminderDelegate;
  private dialogDelegate: DialogDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    notificationStore: ObservableNotificationStore,
    observableScreen: ObservableReminderScreen,
    reminderDelegate: ReminderDelegate,
    dialogDelegate: DialogDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.notificationStore = notificationStore;
    this.observableScreen = observableScreen;
    this.reminderDelegate = reminderDelegate;
    this.dialogDelegate = dialogDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public toggle(): void {
    if (this.observableScreen.reminderSettings.reminderEnabled === true) {
      if (this.notificationStore.hasPermission === false) {
        this.checkAndRequestPermission();
      } else {
        this.observableScreen.reminderSettings.reminderEnabled = false;
      }
    } else {
      this.observableScreen.reminderSettings.reminderEnabled = true;
      this.checkAndRequestPermission();
    }
  }

  public showTimePicker(): void {
    this.observableScreen.shouldShowTimePicker = true;
  }

  public handleTimePicked(date: Date): void {
    this.observableScreen.reminderSettings.hours = date.getHours();
    this.observableScreen.reminderSettings.minutes = date.getMinutes();
    this.observableScreen.shouldShowTimePicker = false;
  }

  public handleTimeCanceled(): void {
    this.observableScreen.shouldShowTimePicker = false;
  }

  public save(): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__EDIT, {
        user: {
          extraData: [
            {
              dataName: UserExtraDataName.GLOBAL_REMINDER,
              dataValue: {
                reminderEnabled: this.observableScreen.reminderSettings
                  .reminderEnabled,
                hours: this.observableScreen.reminderSettings.hours,
                minutes: this.observableScreen.reminderSettings.minutes,
              },
            },
          ],
        },
      }),
      group(
        on(
          ActionType.USER__EDITING,
          (): void => {
            this.showSavingDialog();
          },
        ),
        once(
          ActionType.USER__EDIT_SUCCEEDED,
          (): void => {
            this.showSaveSucceededDialog();
          },
        ),
        once(
          ActionType.USER__EDIT_FAILED,
          (errorBag): void => {
            this.showSaveFailedDialog(errorBag);
          },
        ),
      ),
    );
  }

  private checkAndRequestPermission(): void {
    this.reminderDelegate.checkPermission({
      onChecking: (): void => {
        this.showCheckingPermissionDialog();
      },
      onCheckSucceeded: (hasPermission): void => {
        if (hasPermission === false) {
          this.reminderDelegate.requestPermission({
            onRequesting: _.noop,
            onRequestSucceeded: (): void => {
              // Recheck permission
              this.reminderDelegate.checkPermission();
              this.dialogDelegate.dismiss();
            },
            onRequestFailed: this.showRequestPermissionFailedDialog,
          });
        } else {
          this.dialogDelegate.dismiss();
        }
      },
      onCheckFailed: this.showRequestPermissionFailedDialog,
    });
  }

  private showCheckingPermissionDialog(): void {
    this.dialogDelegate.show({
      message: 'Checking for permission...',
    });
  }

  private showRequestPermissionFailedDialog(errorBag: ErrorBag): void {
    // Use ErrorCode.REMINDER__PERMISSION_REQUIRED
    // instead of ErrorCode.GENERAL__FAILED_TO_GRANT_PERMISSION
    this.dialogDelegate.showFailedDialog(
      {
        errorCode:
          errorBag.errorCode === ErrorCode.GENERAL__FAILED_TO_GRANT_PERMISSION
            ? ErrorCode.REMINDER__PERMISSION_REQUIRED
            : errorBag.errorCode,
        ...errorBag,
      },
      {
        title: 'REQUEST PERMISSION FAILED',
      },
    );
  }

  private showSavingDialog(): void {
    this.dialogDelegate.show({
      message: 'Saving. Please wait...',
    });
  }

  private showSaveSucceededDialog(): void {
    this.dialogDelegate.showSuccessDialog({
      message: 'Saved successfully.',
      onClose: (): void => {
        this.navigatorDelegate.pop();
      },
    });
  }

  private showSaveFailedDialog(errorBag: ErrorBag): void {
    this.dialogDelegate.showFailedDialog(errorBag, {
      title: 'SAVE FAILED',
    });
  }
}
