/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundClass } from 'autobind-decorator';
import { Linking } from 'react-native';

import { config } from '../../constants/config';
import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class FollowUsScreenDelegate {
  private navigatorDelegate: NavigatorDelegate;

  public constructor(navigatorDelegate: NavigatorDelegate) {
    this.navigatorDelegate = navigatorDelegate;
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
      (): void => this.showCannotOpenLinkError()
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
      (): void => this.showCannotOpenLinkError()
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
      (): void => this.fallbackToFacebookPageInBrowser()
    );
  }

  private showCannotOpenLinkError(): void {
    this.navigatorDelegate.showDialog(
      {
        title: 'ERROR OCCURRED',
        message: 'Cannot open the link.',
        showCloseButton: true,
        closeOnTouchOutside: true,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
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
      (): void => this.showCannotOpenLinkError()
    );
  }
}
