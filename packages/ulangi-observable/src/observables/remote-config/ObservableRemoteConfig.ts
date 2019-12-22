/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  AdConfig,
  AppConfig,
  RemoteConfig,
  SyncConfig,
} from '@ulangi/ulangi-common/interfaces';
import { observable } from 'mobx';

import { ObservableLanguage } from '../language/ObservableLanguage';
import { ObservableLanguagePair } from '../language/ObservableLanguagePair';

export class ObservableRemoteConfig implements RemoteConfig {
  @observable
  public languages: readonly ObservableLanguage[];

  @observable
  public supportedLanguagePairs: readonly ObservableLanguagePair[];

  @observable
  public app: AppConfig;

  @observable
  public ad: AdConfig;

  @observable
  public sync: SyncConfig;

  public constructor(
    languages: readonly ObservableLanguage[],
    supportedLanguagePairs: readonly ObservableLanguagePair[],
    app: AppConfig,
    ad: AdConfig,
    sync: SyncConfig
  ) {
    this.languages = languages;
    this.supportedLanguagePairs = supportedLanguagePairs;
    this.app = app;
    this.ad = ad;
    this.sync = sync;
  }
}
