/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import {
  DatabaseEventBus,
  DatabaseFacade,
  ModelFactory,
  ModelList,
} from '@ulangi/ulangi-local-database';
import createSagaMiddleware, {
  SagaMiddleware,
  SagaMiddlewareOptions,
} from 'redux-saga';

import { AdMobAdapter } from '../adapters/AdMobAdapter';
import { AnalyticsAdapter } from '../adapters/AnalyticsAdapter';
import { AudioPlayerAdapter } from '../adapters/AudioPlayerAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { FacebookAdapter } from '../adapters/FacebookAdapter';
import { FileSystemAdapter } from '../adapters/FileSystemAdapter';
import { FirebaseAdapter } from '../adapters/FirebaseAdapter';
import { IapAdapter } from '../adapters/IapAdapter';
import { NetInfoAdapter } from '../adapters/NetInfoAdapter';
import { NotificationsAdapter } from '../adapters/NotificationsAdapter';
import { SystemThemeAdapter } from '../adapters/SystemThemeAdapter';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { RootSaga } from '../sagas/RootSaga';

export class SagaFacade {
  private sagaMiddleware: SagaMiddleware<{}>;

  private env: SagaEnv;
  private config: SagaConfig;
  private modelList: ModelList;
  private database: DatabaseFacade;
  private databaseEventBus: DatabaseEventBus;

  private adMob: null | AdMobAdapter;
  private analytics: null | AnalyticsAdapter;
  private audioPlayer: null | AudioPlayerAdapter;
  private crashlytics: null | CrashlyticsAdapter;
  private facebook: null | FacebookAdapter;
  private fileSystem: null | FileSystemAdapter;
  private firebase: null | FirebaseAdapter;
  private iap: null | IapAdapter;
  private netInfo: null | NetInfoAdapter;
  private notifications: null | NotificationsAdapter;
  private systemTheme: null | SystemThemeAdapter;

  public constructor(
    env: SagaEnv,
    config: SagaConfig,
    adMob: null | AdMobAdapter,
    analytics: null | AnalyticsAdapter,
    audioPlayer: null | AudioPlayerAdapter,
    crashlytics: null | CrashlyticsAdapter,
    facebook: null | FacebookAdapter,
    fileSystem: null | FileSystemAdapter,
    firebase: null | FirebaseAdapter,
    iap: null | IapAdapter,
    netInfo: null | NetInfoAdapter,
    notifications: null | NotificationsAdapter,
    systemTheme: null | SystemThemeAdapter,
    sqliteDatabase: SQLiteDatabaseAdapter,
    databaseLocation: undefined | string,
    sagaMiddlewareOptions: SagaMiddlewareOptions
  ) {
    this.env = env;
    this.config = config;

    this.adMob = adMob;
    this.analytics = analytics;
    this.audioPlayer = audioPlayer;
    this.crashlytics = crashlytics;
    this.facebook = facebook;
    this.fileSystem = fileSystem;
    this.firebase = firebase;
    this.iap = iap;
    this.netInfo = netInfo;
    this.notifications = notifications;
    this.systemTheme = systemTheme;

    this.database = new DatabaseFacade(sqliteDatabase, databaseLocation);
    this.databaseEventBus = new DatabaseEventBus();
    this.modelList = new ModelFactory(this.databaseEventBus).createAllModels();

    this.sagaMiddleware = createSagaMiddleware(sagaMiddlewareOptions);
  }

  public getMiddleware(): SagaMiddleware<{}> {
    return this.sagaMiddleware;
  }

  public run(): void {
    const root = new RootSaga(
      this.modelList,
      this.database,
      this.databaseEventBus,
      this.adMob,
      this.analytics,
      this.audioPlayer,
      this.crashlytics,
      this.facebook,
      this.fileSystem,
      this.firebase,
      this.iap,
      this.netInfo,
      this.notifications,
      this.systemTheme
    );

    this.sagaMiddleware.run(
      (): IterableIterator<any> => root.run(this.env, this.config)
    );
  }
}
