/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import { IObservableValue, action, observable } from 'mobx';

import { ObservableDictionaryEntry } from './ObservableDictionaryEntry';

export class ObservableDictionaryEntryState {
  @observable
  public dictionaryEntry: null | ObservableDictionaryEntry;

  public readonly fetchState: IObservableValue<ActivityState>;

  public readonly fetchError: IObservableValue<undefined | ErrorCode>;

  @action
  public reset(): void {
    this.dictionaryEntry = null;
    this.fetchState.set(ActivityState.INACTIVE);
    this.fetchError.set(undefined);
  }

  public constructor(
    dictionaryEntry: null | ObservableDictionaryEntry,
    fetchState: IObservableValue<ActivityState>,
    fetchError: IObservableValue<undefined | ErrorCode>
  ) {
    this.dictionaryEntry = dictionaryEntry;
    this.fetchState = fetchState;
    this.fetchError = fetchError;
  }
}
