/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Navigation } from '@ulangi/react-native-navigation';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { EventBusFactory, EventFacade } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableKeyboard,
  ObservableLightBox,
  ObservableScreenRegistry,
} from '@ulangi/ulangi-observable';
import { SagaFacade } from '@ulangi/ulangi-saga';
import { StoreFactory } from '@ulangi/ulangi-store';

import { RemoteLogger } from './RemoteLogger';
import { ServiceRegistry } from './ServiceRegistry';
import { config } from './constants/config';
import { env } from './constants/env';
import { RootScreenDelegate } from './delegates/root/RootScreenDelegate';
import { AdapterFactory } from './factories/AdapterFactory';
import { autoUpdateKeyboardState } from './setup/autoUpdateKeyboardState';
import { makeInitialState } from './setup/makeInitialState';
import { registerCustomViews } from './setup/registerCustomViews';
import { registerScreens } from './setup/registerScreens';
import { setDefaultNavigationOptions } from './setup/setDefaultNavigationOptions';

export class App {
  private initialized: boolean;
  private preloaded: boolean;

  public constructor() {
    this.initialized = false;
    this.preloaded = false;
  }

  public start(): void {
    Navigation.events().registerAppLaunchedListener(
      (): void => {
        // On Android,
        // if JS context is not destroyed,
        // we do not need to init again.
        if (!this.isInitialized()) {
          this.init();
        }

        this.render();
      },
    );
  }

  private init(): void {
    setDefaultNavigationOptions();
    registerScreens();
    registerCustomViews();

    const adapters = new AdapterFactory().createAdapters();

    const sagaFacade = new SagaFacade(
      env,
      config,
      adapters.adMob,
      adapters.analytics,
      adapters.audioPlayer,
      adapters.crashlytics,
      adapters.facebook,
      adapters.fileSystem,
      adapters.firebase,
      adapters.iap,
      adapters.netInfo,
      adapters.notifications,
      adapters.sqliteDatabase,
      adapters.systemTheme,
    );

    const eventFacade = new EventFacade();

    const storeFactory = new StoreFactory(
      {
        enableLogging: env.ENABLE_REDUX_LOGGING,
      },
      [sagaFacade.getMiddleware(), eventFacade.getMiddleware()],
    );

    const store = storeFactory.createStore(makeInitialState());

    ServiceRegistry.registerAll({
      eventBusFactory: new EventBusFactory(store, eventFacade),
      rootStore: store.getState(),
      observableLightBox: new ObservableLightBox(),
      observableKeyboard: new ObservableKeyboard(),
      observableConverter: new ObservableConverter(store.getState()),
      observableScreenRegistry: new ObservableScreenRegistry(),
    });

    if (adapters.analytics !== null && adapters.crashlytics !== null) {
      RemoteLogger.useAnalytics(adapters.analytics);
      RemoteLogger.useCrashlytics(adapters.crashlytics);
    }

    autoUpdateKeyboardState(ServiceRegistry.services.observableKeyboard);
    sagaFacade.run();

    this.initialized = true;
  }

  private render(): void {
    const {
      themeStore,
      userStore,
      setStore,
    } = ServiceRegistry.services.rootStore;

    const rootScreenDelegate = new RootScreenDelegate(themeStore);

    if (!this.isPreloaded()) {
      this.preloaded = true;
      rootScreenDelegate.setRootToSingleScreen(ScreenName.PRELOAD_SCREEN);
    } else {
      if (userStore.currentUser !== null) {
        if (setStore.currentSetId !== null) {
          rootScreenDelegate.setRootToTabBasedScreen();
        } else {
          rootScreenDelegate.setRootToSingleScreen(
            ScreenName.CREATE_FIRST_SET_SCREEN,
          );
        }
      } else {
        rootScreenDelegate.setRootToSingleScreen(ScreenName.WELCOME_SCREEN);
      }
    }
  }

  private isInitialized(): boolean {
    return this.initialized;
  }

  private isPreloaded(): boolean {
    return this.preloaded;
  }
}
