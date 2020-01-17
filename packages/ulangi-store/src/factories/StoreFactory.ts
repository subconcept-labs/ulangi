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

import { StoreOptions } from '../interfaces/StoreOptions';
import { transactionMiddleware } from '../middlewares/transactionMiddleware';
import { RootStoreReducer } from '../reducers/RootStoreReducer';

export class StoreFactory {
  private middlewares: readonly Middleware[];
  private options: StoreOptions;

  public constructor(
    options: StoreOptions,
    middlewares?: readonly Middleware[]
  ) {
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

  public createStore(
    rootStore: ObservableRootStore
  ): Store<ObservableRootStore> {
    const rootStoreReducer = new RootStoreReducer(rootStore);

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
