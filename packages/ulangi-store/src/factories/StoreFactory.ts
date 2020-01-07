/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { InferableAction } from '@ulangi/ulangi-action';
import { ObservableRootStore } from '@ulangi/ulangi-observable';
import { Middleware, Store, applyMiddleware, createStore } from 'redux';
import logger, { ReduxLoggerOptions, createLogger } from 'redux-logger';

import { StoreConfig } from '../interfaces/StoreConfig';
import { StoreEnv } from '../interfaces/StoreEnv';
import { StoreOptions } from '../interfaces/StoreOptions';
import { transactionMiddleware } from '../middlewares/transactionMiddleware';
import { RootStoreReducer } from '../reducers/RootStoreReducer';
import { makeInitialState } from '../utils/makeInitialState';

export class StoreFactory {
  private env: StoreEnv;
  private config: StoreConfig;
  private middlewares: readonly Middleware[];
  private options: StoreOptions;

  public constructor(
    env: StoreEnv,
    config: StoreConfig,
    options: StoreOptions,
    middlewares?: readonly Middleware[]
  ) {
    this.env = env;
    this.config = config;
    this.options = options;

    this.middlewares = middlewares || [];
    this.middlewares = this.middlewares.concat(transactionMiddleware);

    if (this.options.enableLogging === true) {
      this.enableLogger();
    }
  }

  private enableLogger(options?: ReduxLoggerOptions): void {
    // If no options provided, use the default logger
    if (typeof options !== 'undefined') {
      this.middlewares = this.middlewares.concat(createLogger(options));
    } else {
      this.middlewares = this.middlewares.concat(logger);
    }
  }

  public make(): Store<ObservableRootStore> {
    const rootStore = makeInitialState(this.config, this.options);
    const rootStoreReducer = new RootStoreReducer(
      rootStore,
      this.env,
      this.config,
      this.options
    );

    return createStore(
      (rootStore, anyAction): ObservableRootStore => {
        rootStoreReducer.perform(
          new InferableAction(anyAction.type, anyAction.payload)
        );
        return rootStore;
      },
      rootStore,
      applyMiddleware(...this.middlewares)
    );
  }
}
