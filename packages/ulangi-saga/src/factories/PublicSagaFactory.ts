/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import NetInfo from '@react-native-community/netinfo';
import { DatabaseFacade, ModelList } from '@ulangi/ulangi-local-database';

import { AdMobAdapter } from '../adapters/AdMobAdapter';
import { AnalyticsAdapter } from '../adapters/AnalyticsAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { FacebookAdapter } from '../adapters/FacebookAdapter';
import { SystemDarkModeAdapter } from '../adapters/SystemDarkModeAdapter';
import { AdSaga } from '../sagas/AdSaga';
import { AppSaga } from '../sagas/AppSaga';
import { AuthSaga } from '../sagas/AuthSaga';
import { DarkModeSaga } from '../sagas/DarkModeSaga';
import { DataSharingSaga } from '../sagas/DataSharingSaga';
import { DatabaseSaga } from '../sagas/DatabaseSaga';
import { NetworkSaga } from '../sagas/NetworkSaga';
import { PublicSaga } from '../sagas/PublicSaga';
import { RemoteConfigSaga } from '../sagas/RemoteConfigSaga';

export class PublicSagaFactory {
  private database: DatabaseFacade;
  private modelList: ModelList;
  private netInfo: typeof NetInfo;
  private adMob: AdMobAdapter;
  private analytics: AnalyticsAdapter;
  private facebook: FacebookAdapter;
  private systemDarkMode: SystemDarkModeAdapter;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    database: DatabaseFacade,
    modelList: ModelList,
    netInfo: typeof NetInfo,
    adMob: AdMobAdapter,
    analytics: AnalyticsAdapter,
    facebook: FacebookAdapter,
    systemDarkMode: SystemDarkModeAdapter,
    crashlytics: CrashlyticsAdapter
  ) {
    this.database = database;
    this.modelList = modelList;
    this.netInfo = netInfo;
    this.adMob = adMob;
    this.analytics = analytics;
    this.facebook = facebook;
    this.systemDarkMode = systemDarkMode;
    this.crashlytics = crashlytics;
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
      new DarkModeSaga(this.systemDarkMode),
    ];
  }
}
