/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { IObservableArray, IObservableValue, action, observable } from 'mobx';

export class ObservableCategoryFormState {
  @observable
  public categoryName: string;

  @observable
  public suggestions: null | IObservableArray<string>;

  @observable
  public noMoreSuggestions: boolean;

  public readonly fetchSuggestionsState: IObservableValue<ActivityState>;

  public constructor(
    categoryName: string,
    suggestions: null | IObservableArray<string>,
    noMoreSuggestions: boolean,
    fetchSuggestionsState: IObservableValue<ActivityState>
  ) {
    this.categoryName = categoryName;
    this.suggestions = suggestions;
    this.noMoreSuggestions = noMoreSuggestions;
    this.fetchSuggestionsState = fetchSuggestionsState;
  }

  @action
  public reset(): void {
    this.categoryName = '';
    this.suggestions = null;
    this.fetchSuggestionsState.set(ActivityState.INACTIVE);
    this.noMoreSuggestions = false;
  }
}
