/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, InferableAction } from '@ulangi/ulangi-action';
import {
  ObservableConverter,
  ObservableLanguagePair,
  ObservableRemoteConfig,
  ObservableRemoteConfigStore,
} from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class RemoteConfigStoreReducer extends Reducer {
  private remoteConfigStore: ObservableRemoteConfigStore;
  private observableConverter: ObservableConverter;

  public constructor(
    remoteConfigStore: ObservableRemoteConfigStore,
    observableConverter: ObservableConverter
  ) {
    super();
    this.remoteConfigStore = remoteConfigStore;
    this.observableConverter = observableConverter;
  }

  public perform(action: InferableAction): void {
    if (action.is(ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED)) {
      this.fetchSucceeded(action);
    }
  }

  private fetchSucceeded(
    action: Action<ActionType.REMOTE_CONFIG__FETCH_SUCCEEDED>
  ): void {
    const { remoteConfig } = action.payload;

    this.remoteConfigStore.remoteConfig = new ObservableRemoteConfig(
      remoteConfig.languages,
      remoteConfig.supportedLanguagePairs.map(
        (pair): ObservableLanguagePair =>
          this.observableConverter.convertToObservableLanguagePair(pair)
      ),
      remoteConfig.app,
      remoteConfig.ad,
      remoteConfig.sync
    );
  }
}
