/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import NetInfo from '@react-native-community/netinfo';
import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';
import {
  DatabaseEventBus,
  DatabaseFacade,
  ModelList,
} from '@ulangi/ulangi-local-database';
import * as FileSystem from 'react-native-fs';
import * as Iap from 'react-native-iap';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, spawn, take } from 'redux-saga/effects';

import { AdMobAdapter } from '../adapters/AdMobAdapter';
import { AnalyticsAdapter } from '../adapters/AnalyticsAdapter';
import { AudioPlayerAdapter } from '../adapters/AudioPlayerAdapter';
import { CrashlyticsAdapter } from '../adapters/CrashlyticsAdapter';
import { FacebookAdapter } from '../adapters/FacebookAdapter';
import { FirebaseAdapter } from '../adapters/FirebaseAdapter';
import { NotificationsAdapter } from '../adapters/NotificationsAdapter';
import { SystemDarkModeAdapter } from '../adapters/SystemDarkModeAdapter';
import { ProtectedSagaFactory } from '../factories/ProtectedSagaFactory';
import { PublicSagaFactory } from '../factories/PublicSagaFactory';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class RootSaga {
  private protectedSagas?: readonly ProtectedSaga[];
  private forkedProtectedSagasTask?: Task;

  private database: DatabaseFacade;
  private firebase: FirebaseAdapter;
  private fileSystem: typeof FileSystem;
  private iap: typeof Iap;
  private admob: AdMobAdapter;
  private analytics: AnalyticsAdapter;
  private facebook: FacebookAdapter;
  private netInfo: typeof NetInfo;
  private audioPlayer: AudioPlayerAdapter;
  private notifications: NotificationsAdapter;
  private systemDarkMode: SystemDarkModeAdapter;
  private crashlytics: CrashlyticsAdapter;
  private databaseEventBus: DatabaseEventBus;
  private modelList: ModelList;

  public constructor(
    database: DatabaseFacade,
    firebase: FirebaseAdapter,
    fileSystem: typeof FileSystem,
    iap: typeof Iap,
    admob: AdMobAdapter,
    analytics: AnalyticsAdapter,
    facebook: FacebookAdapter,
    netInfo: typeof NetInfo,
    audioPlayer: AudioPlayerAdapter,
    notifications: NotificationsAdapter,
    systemDarkMode: SystemDarkModeAdapter,
    crashlytics: CrashlyticsAdapter,
    databaseEventBus: DatabaseEventBus,
    modelList: ModelList
  ) {
    this.database = database;
    this.firebase = firebase;
    this.fileSystem = fileSystem;
    this.iap = iap;
    this.admob = admob;
    this.analytics = analytics;
    this.facebook = facebook;
    this.netInfo = netInfo;
    this.audioPlayer = audioPlayer;
    this.notifications = notifications;
    this.systemDarkMode = systemDarkMode;
    this.crashlytics = crashlytics;
    this.databaseEventBus = databaseEventBus;
    this.modelList = modelList;
  }

  public *run(env: SagaEnv, config: SagaConfig): IterableIterator<any> {
    yield fork([this, this.forkPublicSagas], env, config);

    yield fork([this, this.allowForkProtectedSagas], env, config);
    yield fork([this, this.allowCancelProtectedSagas]);
  }

  private *forkPublicSagas(
    env: SagaEnv,
    config: SagaConfig
  ): IterableIterator<any> {
    const publicSagaFactory = new PublicSagaFactory(
      this.database,
      this.modelList,
      this.netInfo,
      this.admob,
      this.analytics,
      this.facebook,
      this.systemDarkMode,
      this.crashlytics
    );

    for (const saga of publicSagaFactory.createAllPublicSagas()) {
      yield fork([saga, saga.run], env, config);
    }
  }

  private *allowForkProtectedSagas(
    env: SagaEnv,
    config: SagaConfig
  ): IterableIterator<any> {
    while (true) {
      const action: Action<ActionType.ROOT__FORK_PROTECTED_SAGAS> = yield take(
        ActionType.ROOT__FORK_PROTECTED_SAGAS
      );
      const { remoteConfig } = action.payload;

      yield put(createAction(ActionType.ROOT__FORKING_PROTECTED_SAGAS, null));

      this.forkedProtectedSagasTask = yield spawn(
        [this, this.forkProtectedSagas],
        env,
        config,
        remoteConfig
      );

      yield put(
        createAction(ActionType.ROOT__FORK_PROTECTED_SAGAS_SUCCEEDED, null)
      );
    }
  }

  private *allowCancelProtectedSagas(): IterableIterator<any> {
    while (true) {
      yield take(ActionType.ROOT__CANCEL_PROTECTED_SAGAS);
      yield put(
        createAction(ActionType.ROOT__CANCELLING_PROTECTED_SAGAS, null)
      );

      if (typeof this.forkedProtectedSagasTask !== 'undefined') {
        if (typeof this.protectedSagas !== 'undefined') {
          for (const saga of this.protectedSagas) {
            yield call([saga, saga.destroy]);
          }
        }

        yield cancel(this.forkedProtectedSagasTask);
      }
      yield put(
        createAction(ActionType.ROOT__CANCEL_PROTECTED_SAGAS_SUCCEEDED, null)
      );
    }
  }

  private *forkProtectedSagas(
    env: SagaEnv,
    config: SagaConfig,
    remoteConfig: RemoteConfig
  ): IterableIterator<any> {
    const protectedSagaFactory = new ProtectedSagaFactory(
      this.database.getDb('shared'),
      this.database.getDb('user'),
      this.firebase,
      this.fileSystem,
      this.iap,
      this.audioPlayer,
      this.notifications,
      this.databaseEventBus,
      this.modelList
    );

    this.protectedSagas = protectedSagaFactory.createAllProtectedSagas();

    for (const saga of this.protectedSagas) {
      yield fork([saga, saga.run], env, config, remoteConfig);
    }
  }
}
