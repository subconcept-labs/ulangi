/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, observable } from 'mobx';

import { ObservableStore } from './ObservableStore';

export class ObservableNetworkStore extends ObservableStore {
  @observable
  public isConnected: null | boolean;

  @action
  public reset(newNetworkStore: ObservableNetworkStore): void {
    this.isConnected = newNetworkStore.isConnected;
  }

  public constructor(isConnected: null | boolean) {
    super();
    this.isConnected = isConnected;
  }
}
