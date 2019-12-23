/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Linking } from 'react-native';

import { DialogDelegate } from '../dialog/DialogDelegate';

export class LinkingDelegate {
  public dialogDelegate: DialogDelegate;

  public constructor(dialogDelegate: DialogDelegate) {
    this.dialogDelegate = dialogDelegate;
  }

  public openLink(link: string): void {
    Linking.canOpenURL(link).then(
      (supported): void => {
        if (supported) {
          Linking.openURL(link);
        } else {
          this.showCannotOpenLinkError();
        }
      },
      (): void => this.showCannotOpenLinkError(),
    );
  }

  private showCannotOpenLinkError(): void {
    this.dialogDelegate.show({
      message: 'Cannot open link. Please check internet connection',
      showCloseButton: true,
    });
  }
}
