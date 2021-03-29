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

import { AudioPlayerAdapter } from '../adapters/AudioPlayerAdapter';
import { FileSystemAdapter } from '../adapters/FileSystemAdapter';
import { FirebaseAdapter } from '../adapters/FirebaseAdapter';
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

  private audioPlayer: AudioPlayerAdapter;
  private database: DatabaseFacade;
  private databaseEventBus: DatabaseEventBus;
  private fileSystem: FileSystemAdapter;
  private firebase: null | FirebaseAdapter;
  private modelList: ModelList;
  private netInfo: NetInfoAdapter;
  private notifications: null | NotificationsAdapter;
  private systemTheme: SystemThemeAdapter;

  public constructor(
    env: SagaEnv,
    config: SagaConfig,
    audioPlayer: AudioPlayerAdapter,
    fileSystem: FileSystemAdapter,
    firebase: null | FirebaseAdapter,
    netInfo: NetInfoAdapter,
    notifications: null | NotificationsAdapter,
    sqliteDatabase: SQLiteDatabaseAdapter,
    systemTheme: SystemThemeAdapter,
    sagaMiddlewareOptions: SagaMiddlewareOptions
  ) {
    this.env = env;
    this.config = config;

    this.audioPlayer = audioPlayer;
    this.fileSystem = fileSystem;
    this.firebase = firebase;
    this.netInfo = netInfo;
    this.notifications = notifications;
    this.systemTheme = systemTheme;

    this.database = new DatabaseFacade(sqliteDatabase);
    this.databaseEventBus = new DatabaseEventBus();
    this.modelList = new ModelFactory(this.databaseEventBus).createAllModels();

    this.sagaMiddleware = createSagaMiddleware(sagaMiddlewareOptions);
  }

  public getMiddleware(): SagaMiddleware<{}> {
    return this.sagaMiddleware;
  }

  public run(): void {
    const root = new RootSaga(
      this.audioPlayer,
      this.database,
      this.databaseEventBus,
      this.fileSystem,
      this.firebase,
      this.modelList,
      this.netInfo,
      this.notifications,
      this.systemTheme
    );

    this.sagaMiddleware.run(
      (): IterableIterator<any> => root.run(this.env, this.config)
    );
  }
}
