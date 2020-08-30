import './global.css';

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { EventBusFactory, EventFacade } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableLightBox,
  ObservableRootNavigation,
  ObservableScreenRegistry,
  ObservableStackNavigation,
} from '@ulangi/ulangi-observable';
import { SagaFacade } from '@ulangi/ulangi-saga';
import { StoreFactory } from '@ulangi/ulangi-store';
import { remote } from 'electron';
import { observable } from 'mobx';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ServiceRegistry } from './src/ServiceRegistry';
import { config } from './src/constants/config';
import { env } from './src/constants/env';
import { AdapterFactory } from './src/factories/AdapterFactory';
import { makeInitialState } from './src/setup/makeInitialState';
import { RootNavigation } from './src/views/navigation/RootNavigation';

class App extends React.Component {
  public render(): React.ReactElement<any> {
    const databaseLocation = remote.app.getPath('userData') + path.sep;
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
      adapters.systemTheme,
      adapters.sqliteDatabase,
      databaseLocation,
      {
        onError: (error): void => {
          // setImmediate is required for the app to terminate
          // if error is propagated to the root saga
          setImmediate(
            (): void => {
              throw error;
            },
          );
        },
      },
    );

    const eventFacade = new EventFacade();

    const storeFactory = new StoreFactory(
      {
        enableLogging: env.ENABLE_REDUX_LOGGING,
      },
      [sagaFacade.getMiddleware(), eventFacade.getMiddleware()],
    );

    const store = storeFactory.createStore(makeInitialState());

    const rootNavigation = new ObservableRootNavigation(
      new ObservableStackNavigation(
        observable.array([
          {
            componentId: ScreenName.PRELOAD_SCREEN,
            passedProps: {},
          },
        ]),
        null,
      ),
    );

    ServiceRegistry.registerAll({
      eventBusFactory: new EventBusFactory(store, eventFacade),
      rootStore: store.getState(),
      rootNavigation: rootNavigation,
      observableConverter: new ObservableConverter(store.getState()),
      observableScreenRegistry: new ObservableScreenRegistry(),
      observableLightBox: new ObservableLightBox(),
    });

    sagaFacade.run();

    return <RootNavigation navigation={rootNavigation} />;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
