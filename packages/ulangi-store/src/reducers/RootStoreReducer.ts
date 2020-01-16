/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, InferableAction } from '@ulangi/ulangi-action';
import {
  ObservableConverter,
  ObservableRootStore,
} from '@ulangi/ulangi-observable';

import { StoreConfig } from '../interfaces/StoreConfig';
import { StoreEnv } from '../interfaces/StoreEnv';
import { StoreOptions } from '../interfaces/StoreOptions';
import { makeInitialState } from '../utils/makeInitialState';
import { AdStoreReducer } from './AdStoreReducer';
import { NetworkStoreReducer } from './NetworkStoreReducer';
import { NotificationStoreReducer } from './NotificationStoreReducer';
import { PurchaseStoreReducer } from './PurchaseStoreReducer';
import { Reducer } from './Reducer';
import { RemoteConfigStoreReducer } from './RemoteConfigStoreReducer';
import { SetStoreReducer } from './SetStoreReducer';
import { SyncStoreReducer } from './SyncStoreReducer';
import { ThemeStoreReducer } from './ThemeStoreReducer';
import { UserStoreReducer } from './UserStoreReducer';

export class RootStoreReducer extends Reducer {
  private config: StoreConfig;
  private options: StoreOptions;
  private rootStore: ObservableRootStore;
  private reducers: readonly Reducer[];

  public constructor(
    rootStore: ObservableRootStore,
    env: StoreEnv,
    config: StoreConfig,
    options: StoreOptions
  ) {
    super();
    const observableConverter = new ObservableConverter(rootStore);

    this.config = config;
    this.options = options;
    this.rootStore = rootStore;
    this.reducers = [
      new UserStoreReducer(rootStore.userStore, observableConverter),
      new SetStoreReducer(rootStore.setStore, observableConverter),
      new RemoteConfigStoreReducer(
        rootStore.remoteConfigStore,
        observableConverter
      ),
      new NetworkStoreReducer(rootStore.networkStore),
      new SyncStoreReducer(rootStore.syncStore),
      new PurchaseStoreReducer(
        rootStore.purchaseStore,
        env.PREMIUM_LIFETIME_PRODUCT_ID
      ),
      new AdStoreReducer(rootStore.adStore),
      new NotificationStoreReducer(rootStore.notificationStore),
      new ThemeStoreReducer(rootStore.themeStore),
    ];
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.ROOT__RESET_ROOT_STATE)) {
      this.rootStore.reset(makeInitialState(this.config, this.options));
    } else {
      this.reducers.forEach(
        (reducer): void => {
          reducer.perform(action);
        }
      );
    }
  }
}
