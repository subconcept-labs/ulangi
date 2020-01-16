/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundClass } from 'autobind-decorator';
import { Linking } from 'react-native';

import { config } from '../../constants/config';
import { DialogDelegate } from '../dialog/DialogDelegate';

@boundClass
export class FollowUsScreenDelegate {
  private dialogDelegate: DialogDelegate;

  public constructor(dialogDelegate: DialogDelegate) {
    this.dialogDelegate = dialogDelegate;
  }

  public goToReddit(): void {
    Linking.canOpenURL(config.links.reddit).then(
      (supported): void => {
        if (supported) {
          Linking.openURL(config.links.reddit);
        } else {
          this.showCannotOpenLinkError();
        }
      },
      (): void => this.showCannotOpenLinkError(),
    );
  }

  public goToTwitter(): void {
    Linking.canOpenURL(config.links.twitter).then(
      (supported): void => {
        if (supported) {
          Linking.openURL(config.links.twitter);
        } else {
          this.showCannotOpenLinkError();
        }
      },
      (): void => this.showCannotOpenLinkError(),
    );
  }

  public goToFacebookPage(): void {
    Linking.canOpenURL(config.links.facebookPage).then(
      (supported): void => {
        if (supported) {
          Linking.openURL(config.links.facebookPage);
        } else {
          this.showCannotOpenLinkError();
        }
      },
      (): void => this.fallbackToFacebookPageInBrowser(),
    );
  }

  private showCannotOpenLinkError(): void {
    this.dialogDelegate.show({
      title: 'ERROR OCCURRED',
      message: 'Cannot open the link.',
      showCloseButton: true,
      closeOnTouchOutside: true,
    });
  }

  private fallbackToFacebookPageInBrowser(): void {
    Linking.canOpenURL(config.links.facebookPageFallback).then(
      (supported): void => {
        if (supported) {
          Linking.openURL(config.links.facebookPageFallback);
        } else {
          this.showCannotOpenLinkError();
        }
      },
      (): void => this.showCannotOpenLinkError(),
    );
  }
}
