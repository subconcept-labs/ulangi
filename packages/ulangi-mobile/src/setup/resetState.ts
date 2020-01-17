/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
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

import { config } from '../constants/config';

export function resetState(currentState: ObservableRootStore): void {
  const userStore = new ObservableUserStore(null);
  const setStore = new ObservableSetStore(null, null, null);
  const networkStore = new ObservableNetworkStore(
    currentState.networkStore.isConnected,
  );
  const syncStore = new ObservableSyncStore('NOT_SYNCING');
  const remoteConfigStore = new ObservableRemoteConfigStore(null);
  const purchaseStore = new ObservablePurchaseStore(
    currentState.purchaseStore.premiumLifetimeProductId,
    ActivityState.INACTIVE,
    null,
  );
  const adStore = new ObservableAdStore(
    currentState.adStore.isSetUp,
    currentState.adStore.isInitialized,
    currentState.adStore.consentStatus,
    currentState.adStore.isRequestLocationInEeaOrUnknown,
    false,
    0,
  );
  const notificationStore = new ObservableNotificationStore(null);
  const themeStore = new ObservableThemeStore(
    userStore,
    config.user.defaultThemeSettings,
    currentState.themeStore.systemMode,
  );

  currentState.reset(
    new ObservableRootStore(
      userStore,
      setStore,
      networkStore,
      syncStore,
      remoteConfigStore,
      purchaseStore,
      adStore,
      notificationStore,
      themeStore,
    ),
  );
}
