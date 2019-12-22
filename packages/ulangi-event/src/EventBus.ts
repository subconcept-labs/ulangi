/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action } from '@ulangi/ulangi-action';
import { Store } from 'redux';

import { EventFacade } from './EventFacade';
import { EventListener } from './types/EventListener';

export class EventBus {
  private disposers: (() => void)[];

  private store: Store<any>;
  private eventFacade: EventFacade;

  public constructor(store: Store<any>, eventFacade: EventFacade) {
    this.store = store;
    this.eventFacade = eventFacade;
    this.disposers = [];
  }

  public pubsub(action: Action<any>, listener: EventListener): () => void {
    const unsubscribe = this.subscribe(listener);
    this.publish(action);

    return unsubscribe;
  }

  public publish(action: Action<any>): void {
    this.store.dispatch(action);
  }

  public subscribe(listener: EventListener): () => void {
    const disposer = this.eventFacade.subscribe(listener);

    this.disposers.push(disposer);

    return disposer;
  }

  public unsubscribeAll(): void {
    this.disposers.forEach(
      (disposer): void => {
        disposer();
      }
    );
  }
}
