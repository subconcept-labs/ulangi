/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ConsentStatus } from '@ulangi/ulangi-common/enums';
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

import { StoreConfig } from '../interfaces/StoreConfig';
import { StoreOptions } from '../interfaces/StoreOptions';

export function makeInitialState(
  config: StoreConfig,
  options: StoreOptions
): ObservableRootStore {
  const userStore = new ObservableUserStore(null);
  const setStore = new ObservableSetStore(null, null, null);
  const networkStore = new ObservableNetworkStore(null);
  const syncStore = new ObservableSyncStore('NOT_SYNCING');
  const remoteConfigStore = new ObservableRemoteConfigStore(null);
  const purchaseStore = new ObservablePurchaseStore(
    ActivityState.INACTIVE,
    null
  );
  const adStore = new ObservableAdStore(
    false,
    false,
    ConsentStatus.UNKNOWN,
    false,
    false,
    0
  );
  const notificationStore = new ObservableNotificationStore(null);
  const themeStore = new ObservableThemeStore(
    userStore,
    config.user.defaultThemeSettings,
    options.initialSystemTheme
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
    themeStore
  );
}
