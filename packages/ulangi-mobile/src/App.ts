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
  ObservableRootStore,
  ObservableScreenRegistry,
} from '@ulangi/ulangi-observable';
import { SagaFacade } from '@ulangi/ulangi-saga';
import { Store, StoreFactory } from '@ulangi/ulangi-store';

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
  private appInitialized: boolean;
  private disposers: Function[];

  public constructor() {
    this.appInitialized = false;
    this.disposers = [];
  }

  public startOnAppLaunched(): void {
    Navigation.events().registerAppLaunchedListener(
      (): void => {
        this.start();
      },
    );
  }

  private start(): void {
    // On Android,
    // if JS context is not destroyed, we need to do some cleanup
    // but we do not need to register screens and custom views again
    if (this.isInitialized()) {
      this.cleanUp();
    } else {
      setDefaultNavigationOptions();
      registerScreens();
      registerCustomViews();
    }

    const adapters = new AdapterFactory().createAdapters();

    const sagaFacade = new SagaFacade(
      env,
      config,
      adapters.sqliteDatabase,
      adapters.firebase,
      adapters.adMob,
      adapters.analytics,
      adapters.facebook,
      adapters.RNNetInfo,
      adapters.RNFileSystem,
      adapters.RNIap,
      adapters.audioPlayer,
      adapters.notifications,
      adapters.systemTheme,
      adapters.crashlytics,
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

    this.disposers.push(
      autoUpdateKeyboardState(ServiceRegistry.services.observableKeyboard),
    );

    RemoteLogger.useAnalytics(adapters.analytics);
    RemoteLogger.useCrashlytics(adapters.crashlytics);

    sagaFacade.run();

    this.appInitialized = true;

    this.renderPreloadScreen(store);
  }

  private isInitialized(): boolean {
    return this.appInitialized;
  }

  private cleanUp(): void {
    this.disposers.forEach(
      (disposer): void => {
        disposer();
      },
    );
  }

  private renderPreloadScreen(store: Store<ObservableRootStore>): void {
    const rootScreenDelegate = new RootScreenDelegate(
      store.getState().themeStore,
    );

    rootScreenDelegate.setRootToSingleScreen(ScreenName.PRELOAD_SCREEN);
  }
}
