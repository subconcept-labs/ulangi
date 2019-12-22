/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ObservableNetworkStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class NetworkStoreReducer extends Reducer {
  private networkStore: ObservableNetworkStore;

  public constructor(networkStore: ObservableNetworkStore) {
    super();
    this.networkStore = networkStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.NETWORK__CHECK_CONNECTION_SUCCEEDED)) {
      this.checkConnectionSucceeded(action);
    } else if (action.is(ActionType.NETWORK__CONNECTION_CHANGED)) {
      this.connectionChanged(action);
    }
  }

  private checkConnectionSucceeded(
    action: Action<ActionType.NETWORK__CHECK_CONNECTION_SUCCEEDED>
  ): void {
    const { isConnected } = action.payload;
    this.networkStore.isConnected = isConnected;
  }

  private connectionChanged(
    action: Action<ActionType.NETWORK__CONNECTION_CHANGED>
  ): void {
    const { isConnected } = action.payload;
    this.networkStore.isConnected = isConnected;
  }
}
