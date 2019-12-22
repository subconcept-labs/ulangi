/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { ObservableAdStore } from './ObservableAdStore';
import { ObservableAudioStore } from './ObservableAudioStore';
import { ObservableDarkModeStore } from './ObservableDarkModeStore';
import { ObservableNetworkStore } from './ObservableNetworkStore';
import { ObservableNotificationStore } from './ObservableNotificationStore';
import { ObservablePurchaseStore } from './ObservablePurchaseStore';
import { ObservableRemoteConfigStore } from './ObservableRemoteConfigStore';
import { ObservableSetStore } from './ObservableSetStore';
import { ObservableStore } from './ObservableStore';
import { ObservableSyncStore } from './ObservableSyncStore';
import { ObservableUserStore } from './ObservableUserStore';

export class ObservableRootStore extends ObservableStore {
  public readonly userStore: ObservableUserStore;
  public readonly setStore: ObservableSetStore;
  public readonly audioStore: ObservableAudioStore;
  public readonly networkStore: ObservableNetworkStore;
  public readonly syncStore: ObservableSyncStore;
  public readonly remoteConfigStore: ObservableRemoteConfigStore;
  public readonly purchaseStore: ObservablePurchaseStore;
  public readonly adStore: ObservableAdStore;
  public readonly notificationStore: ObservableNotificationStore;
  public readonly darkModeStore: ObservableDarkModeStore;

  public constructor(
    userStore: ObservableUserStore,
    setStore: ObservableSetStore,
    audioStore: ObservableAudioStore,
    networkStore: ObservableNetworkStore,
    syncStore: ObservableSyncStore,
    remoteConfigStore: ObservableRemoteConfigStore,
    purchaseStore: ObservablePurchaseStore,
    adStore: ObservableAdStore,
    notificationStore: ObservableNotificationStore,
    darkModeStore: ObservableDarkModeStore
  ) {
    super();
    this.userStore = userStore;
    this.setStore = setStore;
    this.audioStore = audioStore;
    this.networkStore = networkStore;
    this.syncStore = syncStore;
    this.remoteConfigStore = remoteConfigStore;
    this.purchaseStore = purchaseStore;
    this.adStore = adStore;
    this.notificationStore = notificationStore;
    this.darkModeStore = darkModeStore;
  }

  public reset(newRootStore: ObservableRootStore): void {
    _.forOwn(
      this,
      (childStore, childStoreName): void => {
        const newStore =
          newRootStore[childStoreName as keyof ObservableRootStore];
        if (
          childStore instanceof ObservableStore &&
          newStore instanceof ObservableStore
        ) {
          childStore.reset(newStore);
        }
      }
    );
  }
}
