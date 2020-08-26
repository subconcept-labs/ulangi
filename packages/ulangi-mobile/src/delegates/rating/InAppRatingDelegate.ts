/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize, UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { ButtonStyles } from '@ulangi/ulangi-common/interfaces';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableNetworkStore,
  ObservableRemoteConfigStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import * as moment from 'moment';
import { Platform } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';

import { RemoteLogger } from '../../RemoteLogger';
import { env } from '../../constants/env';
import { fullRoundedButtonStyles } from '../../styles/FullRoundedButtonStyles';
import { DialogDelegate } from '../dialog/DialogDelegate';

export class InAppRatingDelegate {
  private eventBus: EventBus;
  private userStore: ObservableUserStore;
  private networkStore: ObservableNetworkStore;
  private remoteConfigStore: ObservableRemoteConfigStore;
  private dialogDelegate: DialogDelegate;

  public constructor(
    eventBus: EventBus,
    userStore: ObservableUserStore,
    networkStore: ObservableNetworkStore,
    remoteConfigStore: ObservableRemoteConfigStore,
    dialogDelegate: DialogDelegate,
  ) {
    this.eventBus = eventBus;
    this.userStore = userStore;
    this.networkStore = networkStore;
    this.remoteConfigStore = remoteConfigStore;
    this.dialogDelegate = dialogDelegate;
  }

  public autoShowInAppRating(): void {
    if (this.shouldAutoShowInAppRating()) {
      if (Platform.OS === 'ios') {
        this.showInAppRating(true);
      } else {
        this.showRatingRequestDialog();
      }
      // Disable so it won't show again
      this.disableAutoShowInAppRating();
    }
  }

  public showRatingRequestDialog(): void {
    this.dialogDelegate.show({
      title: 'RATE THIS APP',
      message:
        'Do you enjoy using Ulangi? Would you like to take a moment to rate our app?',
      closeOnTouchOutside: true,
      buttonList: [
        {
          text: 'NO, THANKS',
          onPress: (): void => {
            this.dialogDelegate.dismiss();
          },
          styles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidGreyBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
        {
          text: 'RATE THIS APP',
          onPress: (): void => {
            this.showInAppRating(false);
            this.dialogDelegate.dismiss();
          },
          styles: (theme, layout): ButtonStyles =>
            fullRoundedButtonStyles.getSolidPrimaryBackgroundStyles(
              ButtonSize.SMALL,
              theme,
              layout,
            ),
        },
      ],
    });
  }

  public showInAppRating(preferInApp: boolean): void {
    if (env.IOS_APP_ID !== null && env.ANDROID_PACKAGE_NAME !== null) {
      RemoteLogger.logEvent('show_in_app_rating');
      Rate.rate(
        {
          AppleAppID: env.IOS_APP_ID,
          GooglePackageName: env.ANDROID_PACKAGE_NAME,
          AmazonPackageName: env.ANDROID_PACKAGE_NAME,
          OtherAndroidURL: env.ANDROID_STORE,
          preferredAndroidMarket:
            env.ANDROID_STORE === 'Google'
              ? AndroidMarket.Google
              : env.ANDROID_STORE === 'Amazon'
              ? AndroidMarket.Amazon
              : AndroidMarket.Other,
          preferInApp,
          openAppStoreIfInAppFails: !preferInApp,
        },
        (success): void => {
          console.log(success);
        },
      );
    } else {
      console.warn('In-app rating is not configured');
    }
  }

  public disableAutoShowInAppRating(): void {
    this.eventBus.publish(
      createAction(ActionType.USER__EDIT, {
        user: {
          extraData: [
            {
              dataName: UserExtraDataName.AUTO_SHOW_IN_APP_RATING,
              dataValue: false,
            },
          ],
        },
      }),
    );
  }

  private shouldAutoShowInAppRating(): boolean {
    return (
      this.networkStore.isConnected === true &&
      this.isAutoShowInAppRatingEnabled() &&
      this.isAutoShowInAppRatingDue()
    );
  }

  private isAutoShowInAppRatingEnabled(): boolean {
    return (
      typeof this.userStore.existingCurrentUser.autoShowInAppRating ===
        'undefined' ||
      this.userStore.existingCurrentUser.autoShowInAppRating === true
    );
  }

  private isAutoShowInAppRatingDue(): boolean {
    return (
      this.userStore.existingCurrentUser.createdAt !== null &&
      this.userStore.existingCurrentUser.createdAt <
        moment()
          .subtract(
            this.remoteConfigStore.existingRemoteConfig.app
              .showInAppRatingAfterDays,
            'days',
          )
          .toDate()
    );
  }
}
