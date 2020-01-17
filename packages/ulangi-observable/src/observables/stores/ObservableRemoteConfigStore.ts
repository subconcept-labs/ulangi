/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { action, computed, observable } from 'mobx';

import { ObservableRemoteConfig } from '../remote-config/ObservableRemoteConfig';
import { ObservableStore } from './ObservableStore';

export class ObservableRemoteConfigStore extends ObservableStore {
  @observable
  public remoteConfig: null | ObservableRemoteConfig;

  @computed
  public get existingRemoteConfig(): ObservableRemoteConfig {
    return assertExists(this.remoteConfig);
  }

  @action
  public reset(newRemoteConfigStore: ObservableRemoteConfigStore): void {
    this.remoteConfig = newRemoteConfigStore.remoteConfig;
  }

  public constructor(remoteConfig: null | ObservableRemoteConfig) {
    super();
    this.remoteConfig = remoteConfig;
  }
}
