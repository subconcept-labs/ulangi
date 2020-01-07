/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import NetInfo from '@react-native-community/netinfo';
import RNAdConsent from '@ulangi/react-native-ad-consent';
import firebase from '@ulangi/react-native-firebase';
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
  AppsFlyerAdapter,
  CrashlyticsAdapter,
  FirebaseAdapter,
  NotificationsAdapter,
  SagaFacade,
  SystemDarkModeAdapter,
} from '@ulangi/ulangi-saga';
import { StoreFactory } from '@ulangi/ulangi-store';
import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import * as systemDarkMode from 'react-native-dark-mode';
import * as FileSystem from 'react-native-fs';
import * as Iap from 'react-native-iap';
import * as sqlite from 'react-native-sqlite-storage';

import { ServiceRegistry } from './ServiceRegistry';
import { config } from './constants/config';
import { env } from './constants/env';
import { RootScreenDelegate } from './delegates/root/RootScreenDelegate';
import { autoUpdateKeyboardState } from './setup/autoUpdateKeyboardState';
import { setupCustomViews } from './setup/setupCustomViews';
import { setupNavigationDefaultOptions } from './setup/setupNavigationDefaultOptions';
import { setupScreens } from './setup/setupScreens';

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

    const analytics = new AnalyticsAdapter(firebase.analytics());

    const sagaFacade = new SagaFacade(
      env,
      config,
      new SQLiteDatabaseAdapter(sqlite),
      new FirebaseAdapter(firebase),
      new AdMobAdapter(
        // @ts-ignore
        firebase.admob,
        RNAdConsent,
      ),
      new AppsFlyerAdapter(appsFlyer),
      NetInfo,
      FileSystem,
      Iap,
      new NotificationsAdapter(
        firebase.notifications(),
        firebase.messaging(),
        firebase.notifications,
      ),
      new SystemDarkModeAdapter(systemDarkMode),
      new CrashlyticsAdapter(firebase.crashlytics(), true),
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
        initialSystemDarkMode:
          systemDarkMode.initialMode === 'dark' ? Theme.DARK : Theme.LIGHT,
        enableLogging: env.ENABLE_LOGGING,
      },
      [sagaFacade.getMiddleware(), eventFacade.getMiddleware()],
    );

    const store = storeFactory.make();

    const eventBusFactory = new EventBusFactory(store, eventFacade);

    ServiceRegistry.register('analytics', analytics);
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
      store.getState().darkModeStore,
    );

    rootScreenDelegate.setRootToSingleScreen(ScreenName.PRELOAD_SCREEN);
  }
}
