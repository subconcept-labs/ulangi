/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, ActionType, createAction } from '@ulangi/ulangi-action';
import { RemoteConfig } from '@ulangi/ulangi-common/interfaces';
import {
  DatabaseEventBus,
  DatabaseFacade,
  ModelList,
} from '@ulangi/ulangi-local-database';
import { Task } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';

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
import { ProtectedSagaFactory } from '../factories/ProtectedSagaFactory';
import { PublicSagaFactory } from '../factories/PublicSagaFactory';
import { SagaConfig } from '../interfaces/SagaConfig';
import { SagaEnv } from '../interfaces/SagaEnv';
import { ProtectedSaga } from './ProtectedSaga';

export class RootSaga {
  private protectedSagas?: readonly ProtectedSaga[];
  private forkedProtectedSagasTask?: Task;
  private modelList: ModelList;
  private database: DatabaseFacade;
  private databaseEventBus: DatabaseEventBus;

  private admob: null | AdMobAdapter;
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
    modelList: ModelList,
    database: DatabaseFacade,
    databaseEventBus: DatabaseEventBus,
    admob: null | AdMobAdapter,
    analytics: null | AnalyticsAdapter,
    audioPlayer: null | AudioPlayerAdapter,
    crashlytics: null | CrashlyticsAdapter,
    facebook: null | FacebookAdapter,
    fileSystem: null | FileSystemAdapter,
    firebase: null | FirebaseAdapter,
    iap: null | IapAdapter,
    netInfo: null | NetInfoAdapter,
    notifications: null | NotificationsAdapter,
    systemTheme: null | SystemThemeAdapter
  ) {
    this.admob = admob;
    this.analytics = analytics;
    this.audioPlayer = audioPlayer;
    this.crashlytics = crashlytics;
    this.database = database;
    this.databaseEventBus = databaseEventBus;
    this.facebook = facebook;
    this.fileSystem = fileSystem;
    this.firebase = firebase;
    this.iap = iap;
    this.modelList = modelList;
    this.netInfo = netInfo;
    this.notifications = notifications;
    this.systemTheme = systemTheme;
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
      this.modelList,
      this.database,
      this.admob,
      this.analytics,
      this.crashlytics,
      this.facebook,
      this.netInfo,
      this.systemTheme
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

      this.forkedProtectedSagasTask = yield fork(
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
      this.modelList,
      this.databaseEventBus,
      this.database.getDb('shared'),
      this.database.getDb('user'),
      this.audioPlayer,
      this.fileSystem,
      this.firebase,
      this.iap,
      this.notifications
    );

    this.protectedSagas = protectedSagaFactory.createAllProtectedSagas();

    for (const saga of this.protectedSagas) {
      yield fork([saga, saga.run], env, config, remoteConfig);
    }
  }
}
