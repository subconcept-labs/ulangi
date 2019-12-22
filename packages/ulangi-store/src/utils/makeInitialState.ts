/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ConsentStatus } from '@ulangi/ulangi-common/enums';
import {
  ObservableAdStore,
  ObservableAudioStore,
  ObservableDarkModeStore,
  ObservableNetworkStore,
  ObservableNotificationStore,
  ObservablePurchaseStore,
  ObservableRemoteConfigStore,
  ObservableRootStore,
  ObservableSetStore,
  ObservableSyncStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';

import { StoreConfig } from '../interfaces/StoreConfig';
import { StoreOptions } from '../interfaces/StoreOptions';

export function makeInitialState(
  config: StoreConfig,
  options: StoreOptions
): ObservableRootStore {
  const userStore = new ObservableUserStore(null);
  const setStore = new ObservableSetStore(null, null, null);
  const audioStore = new ObservableAudioStore(observable.map());
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
  const darkModeStore = new ObservableDarkModeStore(
    userStore,
    config.user.defaultDarkModeSettings,
    options.initialSystemDarkMode
  );

  return new ObservableRootStore(
    userStore,
    setStore,
    audioStore,
    networkStore,
    syncStore,
    remoteConfigStore,
    purchaseStore,
    adStore,
    notificationStore,
    darkModeStore
  );
}
