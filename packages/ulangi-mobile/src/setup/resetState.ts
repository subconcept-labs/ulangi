/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableEventStore,
  ObservableNetworkStore,
  ObservableNotificationStore,
  ObservableRemoteConfigStore,
  ObservableRootStore,
  ObservableSetStore,
  ObservableSyncStore,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';

import { config } from '../constants/config';

export function resetState(currentState: ObservableRootStore): void {
  const userStore = new ObservableUserStore(null);
  const setStore = new ObservableSetStore(null, null, null);
  const networkStore = new ObservableNetworkStore(
    currentState.networkStore.isConnected,
  );
  const syncStore = new ObservableSyncStore('NOT_SYNCING');
  const remoteConfigStore = new ObservableRemoteConfigStore(null);
  const notificationStore = new ObservableNotificationStore(null);
  const themeStore = new ObservableThemeStore(
    userStore,
    config.user.defaultThemeSettings,
    currentState.themeStore.systemMode,
  );
  const eventStore = new ObservableEventStore(observable.array([]));

  currentState.reset(
    new ObservableRootStore(
      userStore,
      setStore,
      networkStore,
      syncStore,
      remoteConfigStore,
      notificationStore,
      themeStore,
      eventStore,
    ),
  );
}
