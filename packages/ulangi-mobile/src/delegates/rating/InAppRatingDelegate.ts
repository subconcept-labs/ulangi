/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ButtonSize, UserExtraDataName } from '@ulangi/ulangi-common/enums';
import { EventBus } from '@ulangi/ulangi-event';
import {
  ObservableRemoteConfigStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import * as moment from 'moment';
import { Platform } from 'react-native';
import Rate from 'react-native-rate';

import { RemoteLogger } from '../../RemoteLogger';
import { env } from '../../constants/env';
import { FullRoundedButtonStyle } from '../../styles/FullRoundedButtonStyle';
import { DialogDelegate } from '../dialog/DialogDelegate';

export class InAppRatingDelegate {
  private eventBus: EventBus;
  private userStore: ObservableUserStore;
  private remoteConfigStore: ObservableRemoteConfigStore;
  private dialogDelegate: DialogDelegate;

  public constructor(
    eventBus: EventBus,
    userStore: ObservableUserStore,
    remoteConfigStore: ObservableRemoteConfigStore,
    dialogDelegate: DialogDelegate,
  ) {
    this.eventBus = eventBus;
    this.userStore = userStore;
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
          styles: FullRoundedButtonStyle.getFullGreyBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
        {
          text: 'RATE THIS APP',
          onPress: (): void => {
            this.showInAppRating(false);
            this.dialogDelegate.dismiss();
          },
          styles: FullRoundedButtonStyle.getFullPrimaryBackgroundStyles(
            ButtonSize.SMALL,
          ),
        },
      ],
    });
  }

  public showInAppRating(preferInApp: boolean): void {
    if (env.APPLE_APP_ID !== null && env.GOOGLE_PACKAGE_NAME !== null) {
      RemoteLogger.logEvent('show_in_app_rating');
      Rate.rate(
        {
          AppleAppID: env.APPLE_APP_ID,
          GooglePackageName: env.GOOGLE_PACKAGE_NAME,
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
      this.isAutoShowInAppRatingEnabled() && this.isAutoShowInAppRatingDue()
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
