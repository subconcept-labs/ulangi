/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DatabaseFacade, ModelList } from '@ulangi/ulangi-local-database';

import { AdMobAdapter } from '../adapters/AdMobAdapter';
import { AnalyticsAdapter } from '../adapters/AnalyticsAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { FacebookAdapter } from '../adapters/FacebookAdapter';
import { NetInfoAdapter } from '../adapters/NetInfoAdapter';
import { SystemThemeAdapter } from '../adapters/SystemThemeAdapter';
import { AdSaga } from '../sagas/AdSaga';
import { AppSaga } from '../sagas/AppSaga';
import { AuthSaga } from '../sagas/AuthSaga';
import { DataSharingSaga } from '../sagas/DataSharingSaga';
import { DatabaseSaga } from '../sagas/DatabaseSaga';
import { NetworkSaga } from '../sagas/NetworkSaga';
import { PublicSaga } from '../sagas/PublicSaga';
import { RemoteConfigSaga } from '../sagas/RemoteConfigSaga';
import { ThemeSaga } from '../sagas/ThemeSaga';

export class PublicSagaFactory {
  private adMob: AdMobAdapter;
  private analytics: AnalyticsAdapter;
  private crashlytics: CrashlyticsAdapter;
  private database: DatabaseFacade;
  private facebook: FacebookAdapter;
  private modelList: ModelList;
  private netInfo: NetInfoAdapter;
  private systemTheme: SystemThemeAdapter;

  public constructor(
    adMob: AdMobAdapter,
    analytics: AnalyticsAdapter,
    crashlytics: CrashlyticsAdapter,
    database: DatabaseFacade,
    facebook: FacebookAdapter,
    modelList: ModelList,
    netInfo: NetInfoAdapter,
    systemTheme: SystemThemeAdapter
  ) {
    this.adMob = adMob;
    this.analytics = analytics;
    this.crashlytics = crashlytics;
    this.database = database;
    this.facebook = facebook;
    this.modelList = modelList;
    this.netInfo = netInfo;
    this.systemTheme = systemTheme;
  }

  public createAllPublicSagas(): readonly PublicSaga[] {
    return [
      new AppSaga(),
      new DataSharingSaga(this.analytics, this.crashlytics, this.facebook),
      new AuthSaga(
        this.database,
        this.modelList.sessionModel,
        this.modelList.userModel
      ),
      new DatabaseSaga(this.database),
      new NetworkSaga(this.netInfo),
      new RemoteConfigSaga(this.database, this.modelList.remoteConfigModel),
      new AdSaga(this.adMob),
      new ThemeSaga(this.systemTheme),
    ];
  }
}
