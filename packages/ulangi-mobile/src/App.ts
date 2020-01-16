/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import RNNetInfo from '@react-native-community/netinfo';
import RNAdConsent from '@ulangi/react-native-ad-consent';
import RNFirebase from '@ulangi/react-native-firebase';
import { SQLiteDatabaseAdapter } from '@ulangi/sqlite-adapter';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { EventBusFactory, EventFacade } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableKeyboard,
  ObservableLightBox,
  ObservableScreenRegistry,
} from '@ulangi/ulangi-observable';
import {
  AdMobAdapter,
  AnalyticsAdapter,
  AudioPlayerAdapter,
  CrashlyticsAdapter,
  FacebookAdapter,
  FirebaseAdapter,
  NotificationsAdapter,
  SagaFacade,
  SystemThemeAdapter,
} from '@ulangi/ulangi-saga';
import { StoreFactory } from '@ulangi/ulangi-store';
import { Platform } from 'react-native';
import * as RNDarkMode from 'react-native-dark-mode';
import * as RNFacebook from 'react-native-fbsdk';
import * as RNFileSystem from 'react-native-fs';
import * as RNIap from 'react-native-iap';
import * as RNSqlite from 'react-native-sqlite-storage';

import { RemoteLogger } from './RemoteLogger';
import { ServiceRegistry } from './ServiceRegistry';
import { config } from './constants/config';
import { env } from './constants/env';
import { RootScreenDelegate } from './delegates/root/RootScreenDelegate';
import { autoUpdateKeyboardState } from './setup/autoUpdateKeyboardState';
import { setupCustomViews } from './setup/setupCustomViews';
import { setupNavigationDefaultOptions } from './setup/setupNavigationDefaultOptions';
import { setupScreens } from './setup/setupScreens';

import RNAudioPlayer = require('react-native-sound');

export class App {
  private started: boolean;
  private unsubscribeAutoUpdateKeyboard?: () => void;

  public constructor() {
    this.started = false;
  }

  public init(): void {
    setupScreens();
    setupCustomViews();
  }

  public isStarted(): boolean {
    return this.started;
  }

  public clearApp(): void {
    if (typeof this.unsubscribeAutoUpdateKeyboard !== 'undefined') {
      this.unsubscribeAutoUpdateKeyboard();
    }
  }

  public startApp(): void {
    this.started = true;

    setupNavigationDefaultOptions();

    const sqliteDatabase = new SQLiteDatabaseAdapter(RNSqlite);
    const firebase = new FirebaseAdapter(RNFirebase);
    const analytics = new AnalyticsAdapter(RNFirebase.analytics());
    const crashlytics = new CrashlyticsAdapter(RNFirebase.crashlytics());
    // @ts-ignore
    const adMob = new AdMobAdapter(RNFirebase.admob, RNAdConsent);
    const facebook = new FacebookAdapter(RNFacebook);
    const audioPlayer = new AudioPlayerAdapter(RNAudioPlayer);
    const notifications = new NotificationsAdapter(
      RNFirebase.notifications(),
      RNFirebase.messaging(),
      RNFirebase.notifications,
    );
    const systemTheme = new SystemThemeAdapter(RNDarkMode);

    RemoteLogger.useAnalytics(analytics);
    RemoteLogger.useCrashlytics(crashlytics);

    const sagaFacade = new SagaFacade(
      env,
      config,
      sqliteDatabase,
      firebase,
      adMob,
      analytics,
      facebook,
      RNNetInfo,
      RNFileSystem,
      RNIap,
      audioPlayer,
      notifications,
      systemTheme,
      crashlytics,
    );

    const eventFacade = new EventFacade();

    const storeFactory = new StoreFactory(
      {
        PREMIUM_LIFETIME_PRODUCT_ID: Platform.select({
          ios: env.IOS_PREMIUM_LIFETIME_PRODUCT_ID,
          android: env.ANDROID_PREMIUM_LIFETIME_PRODUCT_ID,
        }),
      },
      config,
      {
        initialSystemTheme:
          RNDarkMode.initialMode === 'dark' ? Theme.DARK : Theme.LIGHT,
        enableLogging: env.ENABLE_LOGGING,
      },
      [sagaFacade.getMiddleware(), eventFacade.getMiddleware()],
    );

    const store = storeFactory.make();

    const eventBusFactory = new EventBusFactory(store, eventFacade);

    ServiceRegistry.register('eventBusFactory', eventBusFactory);
    ServiceRegistry.register('rootStore', store.getState());
    ServiceRegistry.register('observableLightBox', new ObservableLightBox());
    ServiceRegistry.register('observableKeyboard', new ObservableKeyboard());
    ServiceRegistry.register(
      'observableConverter',
      new ObservableConverter(store.getState()),
    );
    ServiceRegistry.register(
      'observableScreenRegistry',
      new ObservableScreenRegistry(),
    );

    this.unsubscribeAutoUpdateKeyboard = autoUpdateKeyboardState(
      ServiceRegistry.get('observableKeyboard'),
    );

    sagaFacade.run();

    const rootScreenDelegate = new RootScreenDelegate(
      store.getState().themeStore,
    );

    rootScreenDelegate.setRootToSingleScreen(ScreenName.PRELOAD_SCREEN);
  }
}
