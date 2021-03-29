/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
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
import * as RNDarkMode from 'react-native-dark-mode';

import { config } from '../constants/config';

export function makeInitialState(): ObservableRootStore {
  const userStore = new ObservableUserStore(null);
  const setStore = new ObservableSetStore(null, null, null);
  const networkStore = new ObservableNetworkStore(null);
  const syncStore = new ObservableSyncStore('NOT_SYNCING');
  const remoteConfigStore = new ObservableRemoteConfigStore(null);
  const notificationStore = new ObservableNotificationStore(null);
  const themeStore = new ObservableThemeStore(
    userStore,
    config.user.defaultThemeSettings,
    RNDarkMode.initialMode === 'dark' ? Theme.DARK : Theme.LIGHT,
  );
  const eventStore = new ObservableEventStore(observable.array([]));

  return new ObservableRootStore(
    userStore,
    setStore,
    networkStore,
    syncStore,
    remoteConfigStore,
    notificationStore,
    themeStore,
    eventStore,
  );
}
