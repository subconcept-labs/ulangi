/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { InferableAction } from '@ulangi/ulangi-action';
import {
  ObservableConverter,
  ObservableRootStore,
} from '@ulangi/ulangi-observable';

import { EventStoreReducer } from './EventStoreReducer';
import { NetworkStoreReducer } from './NetworkStoreReducer';
import { NotificationStoreReducer } from './NotificationStoreReducer';
import { Reducer } from './Reducer';
import { RemoteConfigStoreReducer } from './RemoteConfigStoreReducer';
import { SetStoreReducer } from './SetStoreReducer';
import { SyncStoreReducer } from './SyncStoreReducer';
import { ThemeStoreReducer } from './ThemeStoreReducer';
import { UserStoreReducer } from './UserStoreReducer';

export class RootStoreReducer extends Reducer {
  private reducers: readonly Reducer[];

  public constructor(rootStore: ObservableRootStore) {
    super();
    const observableConverter = new ObservableConverter(rootStore);

    this.reducers = [
      new UserStoreReducer(rootStore.userStore, observableConverter),
      new SetStoreReducer(rootStore.setStore, observableConverter),
      new RemoteConfigStoreReducer(
        rootStore.remoteConfigStore,
        observableConverter
      ),
      new NetworkStoreReducer(rootStore.networkStore),
      new SyncStoreReducer(rootStore.syncStore),
      new NotificationStoreReducer(rootStore.notificationStore),
      new ThemeStoreReducer(rootStore.themeStore),
      new EventStoreReducer(rootStore.eventStore),
    ];
  }

  public perform(action: InferableAction): void {
    this.reducers.forEach(
      (reducer): void => {
        reducer.perform(action);
      }
    );
  }
}
