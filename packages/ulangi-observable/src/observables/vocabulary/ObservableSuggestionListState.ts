/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import { Attribution } from '@ulangi/ulangi-common/interfaces';
import { IObservableArray, IObservableValue, action, observable } from 'mobx';

import { ObservableSuggestion } from './ObservableSuggestion';

export class ObservableSuggestionListState {

  @observable
  public suggestionList: null | IObservableArray<ObservableSuggestion>;

  @observable
  public attribution: null | Attribution;

  public readonly fetchState: IObservableValue<ActivityState>;

  public readonly fetchError: IObservableValue<undefined | ErrorCode>;

  @action
  public reset(): void {
    this.suggestionList = null;
    this.attribution = null;
    this.fetchState.set(ActivityState.INACTIVE);
    this.fetchError.set(undefined);
  }

  public constructor(
    suggestionList: null | IObservableArray<ObservableSuggestion>,
    attribution: null | Attribution,
    fetchState: IObservableValue<ActivityState>,
    fetchError: IObservableValue<undefined | ErrorCode>
  ) {
    this.suggestionList = suggestionList;
    this.attribution = attribution;
    this.fetchState = fetchState;
    this.fetchError = fetchError;
  }
}
