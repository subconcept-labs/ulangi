/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Action } from '@ulangi/ulangi-action';
import * as _ from 'lodash';
import { IObservableArray, action, observable } from 'mobx';

import { ObservableStore } from '../stores/ObservableStore';

export class ObservableEventStore extends ObservableStore {
  @observable
  public eventList: IObservableArray<Action<any>>;

  @action
  public reset(): void {
    _.noop();
  }

  public constructor(eventList: IObservableArray<Action<any>>) {
    super();
    this.eventList = eventList;
  }
}
