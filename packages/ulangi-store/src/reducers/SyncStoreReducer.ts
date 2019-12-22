/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, InferableAction } from '@ulangi/ulangi-action';
import { ObservableSyncStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class SyncStoreReducer extends Reducer {
  private syncStore: ObservableSyncStore;

  public constructor(syncStore: ObservableSyncStore) {
    super();
    this.syncStore = syncStore;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.SYNC__SYNCING)) {
      this.syncing();
    } else if (action.is(ActionType.SYNC__SYNC_COMPLETED)) {
      this.syncCompleted();
    }
  }

  private syncing(): void {
    this.syncStore.currentState = 'SYNCING';
  }

  private syncCompleted(): void {
    this.syncStore.currentState = 'NOT_SYNCING';
  }
}
