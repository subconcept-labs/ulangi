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
import sagaMiddlewareFactory, { SagaMiddleware } from 'redux-saga';

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
  private sagaMiddlware = sagaMiddlewareFactory();

  private env: SagaEnv;
  private config: SagaConfig;

  private adMob: null | AdMobAdapter;
  private analytics: null | AnalyticsAdapter;
  private audioPlayer: AudioPlayerAdapter;
  private crashlytics: null | CrashlyticsAdapter;
  private database: DatabaseFacade;
  private databaseEventBus: DatabaseEventBus;
  private facebook: null | FacebookAdapter;
  private fileSystem: FileSystemAdapter;
  private firebase: null | FirebaseAdapter;
  private iap: null | IapAdapter;
  private modelList: ModelList;
  private netInfo: NetInfoAdapter;
  private notifications: null | NotificationsAdapter;
  private systemTheme: SystemThemeAdapter;

  public constructor(
    env: SagaEnv,
    config: SagaConfig,
    adMob: null | AdMobAdapter,
    analytics: null | AnalyticsAdapter,
    audioPlayer: AudioPlayerAdapter,
    crashlytics: null | CrashlyticsAdapter,
    facebook: null | FacebookAdapter,
    fileSystem: FileSystemAdapter,
    firebase: null | FirebaseAdapter,
    iap: null | IapAdapter,
    netInfo: NetInfoAdapter,
    notifications: null | NotificationsAdapter,
    sqliteDatabase: SQLiteDatabaseAdapter,
    systemTheme: SystemThemeAdapter
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

    this.database = new DatabaseFacade(sqliteDatabase);
    this.databaseEventBus = new DatabaseEventBus();
    this.modelList = new ModelFactory(this.databaseEventBus).createAllModels();
  }

  public getMiddleware(): SagaMiddleware<{}> {
    return this.sagaMiddlware;
  }

  public run(): void {
    const root = new RootSaga(
      this.adMob,
      this.analytics,
      this.audioPlayer,
      this.crashlytics,
      this.database,
      this.databaseEventBus,
      this.facebook,
      this.fileSystem,
      this.firebase,
      this.iap,
      this.modelList,
      this.netInfo,
      this.notifications,
      this.systemTheme
    );

    this.sagaMiddlware.run(
      (): IterableIterator<any> => root.run(this.env, this.config)
    );
  }
}
