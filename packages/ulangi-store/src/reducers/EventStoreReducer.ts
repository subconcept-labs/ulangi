/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action, InferableAction } from '@ulangi/ulangi-action';
import { ObservableEventStore } from '@ulangi/ulangi-observable';

import { Reducer } from './Reducer';

export class EventStoreReducer extends Reducer {
  private eventStore: ObservableEventStore;

  public constructor(eventStore: ObservableEventStore) {
    super();
    this.eventStore = eventStore;
  }

  public perform(action: InferableAction): void {
    this.recordEvent(action);
  }

  private recordEvent(action: Action<any>): void {
    this.eventStore.eventList.unshift({
      type: action.type,
      payload: action.payload,
    });

    // Keep only 200 latest events
    if (this.eventStore.eventList.length > 200) {
      this.eventStore.eventList.pop();
    }
  }
}
