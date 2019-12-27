/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ContactUsFormType } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableContactUsScreen,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';

import { LightBoxDialogIds } from '../../constants/ids/LightBoxDialogIds';
import { ErrorConverter } from '../../converters/ErrorConverter';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

export class ContactUsScreenDelegate {
  private errorConverter = new ErrorConverter();

  private eventBus: EventBus;
  private userStore: ObservableUserStore;
  private observableScreen: ObservableContactUsScreen;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    eventBus: EventBus,
    userStore: ObservableUserStore,
    observableScreen: ObservableContactUsScreen,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.eventBus = eventBus;
    this.userStore = userStore;
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
  }

  public send(): void {
    switch (this.observableScreen.formType) {
      case ContactUsFormType.FEATURE_REQUEST:
        this.sendFeatureRequest(
          this.userStore.existingCurrentUser.email,
          this.observableScreen.text,
        );
        break;
      case ContactUsFormType.REPORT_A_BUG:
        this.sendBugReport(
          this.userStore.existingCurrentUser.email,
          this.observableScreen.text,
        );
        break;
      case ContactUsFormType.REPORT_AN_ERROR:
        this.sendAnErrorReport(
          this.userStore.existingCurrentUser.email,
          this.observableScreen.text,
        );
        break;
      default:
        this.sendSupportMessage(
          this.userStore.existingCurrentUser.email,
          this.observableScreen.text,
        );
    }
  }

  private sendFeatureRequest(userEmail: string, message: string): void {
    this.sendMessage(
      'feature@ulangi.com',
      userEmail,
      `Feature request from ${userEmail}`,
      `From ${userEmail}:\n${message}`,
      {
        onContactingAdmin: (): void => {
          this.showContactingAdminDialog();
        },
        onContactAdminSucceeded: (): void => {
          this.showContactAdminSucceededDialog();
        },
        onContactAdminFailed: (errorCode): void => {
          this.showContactAdminFailedDialog(errorCode);
        },
      },
    );
  }

  private sendBugReport(userEmail: string, message: string): void {
    this.sendMessage(
      'bug@ulangi.com',
      userEmail,
      `Bug report from ${userEmail}`,
      `From ${userEmail}:\n${message}`,
      {
        onContactingAdmin: (): void => {
          this.showContactingAdminDialog();
        },
        onContactAdminSucceeded: (): void => {
          this.showContactAdminSucceededDialog();
        },
        onContactAdminFailed: (errorCode): void => {
          this.showContactAdminFailedDialog(errorCode);
        },
      },
    );
  }

  private sendAnErrorReport(userEmail: string, message: string): void {
    this.sendMessage(
      'error@ulangi.com',
      userEmail,
      `Error report from ${userEmail}`,
      `From ${userEmail}:\n${message}`,
      {
        onContactingAdmin: (): void => {
          this.showContactingAdminDialog();
        },
        onContactAdminSucceeded: (): void => {
          this.showContactAdminSucceededDialog();
        },
        onContactAdminFailed: (errorCode): void => {
          this.showContactAdminFailedDialog(errorCode);
        },
      },
    );
  }

  private sendSupportMessage(userEmail: string, message: string): void {
    this.sendMessage(
      'support@ulangi.com',
      userEmail,
      `Support requested from ${userEmail}`,
      `From ${userEmail}:\n${message}`,
      {
        onContactingAdmin: (): void => {
          this.showContactingAdminDialog();
        },
        onContactAdminSucceeded: (): void => {
          this.showContactAdminSucceededDialog();
        },
        onContactAdminFailed: (errorCode): void => {
          this.showContactAdminFailedDialog(errorCode);
        },
      },
    );
  }

  private showContactingAdminDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        message: 'Sending. Please wait...',
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showContactAdminSucceededDialog(): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.SUCCESS_DIALOG,
        message: 'Sent successfully.',
        showCloseButton: true,
        closeOnTouchOutside: true,
        onClose: (): void => {
          this.navigatorDelegate.pop();
        },
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private showContactAdminFailedDialog(errorCode: string): void {
    this.navigatorDelegate.showDialog(
      {
        testID: LightBoxDialogIds.FAILED_DIALOG,
        message: this.errorConverter.convertToMessage(errorCode),
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  private sendMessage(
    adminEmail: string,
    replyToEmail: string,
    subject: string,
    message: string,
    callback: {
      onContactingAdmin: () => void;
      onContactAdminSucceeded: () => void;
      onContactAdminFailed: (errorCode: string) => void;
    },
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.USER__CONTACT_ADMIN, {
        adminEmail,
        replyToEmail,
        subject,
        message,
      }),
      group(
        on(ActionType.USER__CONTACT_ADMIN, callback.onContactingAdmin),
        once(
          ActionType.USER__CONTACT_ADMIN_SUCCEEDED,
          callback.onContactAdminSucceeded,
        ),
        once(
          ActionType.USER__CONTACT_ADMIN_FAILED,
          ({ errorCode }): void => callback.onContactAdminFailed(errorCode),
        ),
      ),
    );
  }
}
