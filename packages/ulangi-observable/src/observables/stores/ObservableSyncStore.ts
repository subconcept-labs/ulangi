/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { action, observable } from 'mobx';

import { ObservableStore } from './ObservableStore';

export class ObservableSyncStore extends ObservableStore {
  @observable
  public currentState: 'SYNCING' | 'NOT_SYNCING';

  @action
  public reset(newSyncStore: ObservableSyncStore): void {
    this.currentState = newSyncStore.currentState;
  }

  public constructor(currentState: 'SYNCING' | 'NOT_SYNCING') {
    super();
    this.currentState = currentState;
  }
}
