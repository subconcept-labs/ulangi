/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ActivityState,
  ConsentStatus,
  Theme,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableAdStore,
  ObservableNetworkStore,
  ObservableNotificationStore,
  ObservablePurchaseStore,
  ObservableRemoteConfigStore,
  ObservableRootStore,
  ObservableSetStore,
  ObservableSyncStore,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { Platform } from 'react-native';
import * as RNDarkMode from 'react-native-dark-mode';

import { config } from '../constants/config';
import { env } from '../constants/env';

export function makeInitialState(): ObservableRootStore {
  const userStore = new ObservableUserStore(null);
  const setStore = new ObservableSetStore(null, null, null);
  const networkStore = new ObservableNetworkStore(null);
  const syncStore = new ObservableSyncStore('NOT_SYNCING');
  const remoteConfigStore = new ObservableRemoteConfigStore(null);
  const purchaseStore = new ObservablePurchaseStore(
    Platform.select({
      ios: env.IOS_PREMIUM_LIFETIME_PRODUCT_ID,
      android: env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID,
    }) || 'N/A',
    ActivityState.INACTIVE,
    null,
  );
  const adStore = new ObservableAdStore(
    false,
    false,
    ConsentStatus.UNKNOWN,
    false,
    false,
    0,
  );
  const notificationStore = new ObservableNotificationStore(null);
  const themeStore = new ObservableThemeStore(
    userStore,
    config.user.defaultThemeSettings,
    RNDarkMode.initialMode === 'dark' ? Theme.DARK : Theme.LIGHT,
  );

  return new ObservableRootStore(
    userStore,
    setStore,
    networkStore,
    syncStore,
    remoteConfigStore,
    purchaseStore,
    adStore,
    notificationStore,
    themeStore,
  );
}
