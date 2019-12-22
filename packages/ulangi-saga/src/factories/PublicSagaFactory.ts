/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import NetInfo from '@react-native-community/netinfo';
import { DatabaseFacade, ModelList } from '@ulangi/ulangi-local-database';

import { AdMobAdapter } from '../adapters/AdMobAdapter';
import { AppsFlyerAdapter } from '../adapters/AppsFlyerAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { SystemDarkModeAdapter } from '../adapters/SystemDarkModeAdapter';
import { AdSaga } from '../sagas/AdSaga';
import { AppSaga } from '../sagas/AppSaga';
import { AppsFlyerSaga } from '../sagas/AppsFlyerSaga';
import { AuthSaga } from '../sagas/AuthSaga';
import { DarkModeSaga } from '../sagas/DarkModeSaga';
import { DatabaseSaga } from '../sagas/DatabaseSaga';
import { NetworkSaga } from '../sagas/NetworkSaga';
import { PublicSaga } from '../sagas/PublicSaga';
import { RemoteConfigSaga } from '../sagas/RemoteConfigSaga';

export class PublicSagaFactory {
  private database: DatabaseFacade;
  private modelList: ModelList;
  private netInfo: typeof NetInfo;
  private adMob: AdMobAdapter;
  private appsFlyer: AppsFlyerAdapter;
  private systemDarkMode: SystemDarkModeAdapter;
  private crashlytics: CrashlyticsAdapter;

  public constructor(
    database: DatabaseFacade,
    modelList: ModelList,
    netInfo: typeof NetInfo,
    adMob: AdMobAdapter,
    appsFlyer: AppsFlyerAdapter,
    systemDarkMode: SystemDarkModeAdapter,
    crashlytics: CrashlyticsAdapter
  ) {
    this.database = database;
    this.modelList = modelList;
    this.netInfo = netInfo;
    this.adMob = adMob;
    this.appsFlyer = appsFlyer;
    this.systemDarkMode = systemDarkMode;
    this.crashlytics = crashlytics;
  }

  public createAllPublicSagas(): readonly PublicSaga[] {
    return [
      new AppSaga(),
      new AppsFlyerSaga(this.appsFlyer, this.crashlytics),
      new AuthSaga(
        this.database,
        this.modelList.sessionModel,
        this.modelList.userModel,
        this.crashlytics
      ),
      new DatabaseSaga(this.database, this.crashlytics),
      new NetworkSaga(this.netInfo, this.crashlytics),
      new RemoteConfigSaga(
        this.database,
        this.modelList.remoteConfigModel,
        this.crashlytics
      ),
      new AdSaga(this.adMob, this.crashlytics),
      new DarkModeSaga(this.systemDarkMode),
    ];
  }
}
