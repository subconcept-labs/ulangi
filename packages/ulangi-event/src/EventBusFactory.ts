/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Store } from 'redux';

import { EventBus } from './EventBus';
import { EventFacade } from './EventFacade';

export class EventBusFactory {
  private store: Store<any>;
  private eventFacade: EventFacade;

  public constructor(store: Store<any>, eventFacade: EventFacade) {
    this.store = store;
    this.eventFacade = eventFacade;
  }

  public createBus(): EventBus {
    return new EventBus(this.store, this.eventFacade);
  }
}
