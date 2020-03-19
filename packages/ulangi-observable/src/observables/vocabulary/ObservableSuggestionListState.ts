/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import {
  Attribution,
  VocabularyExtraFields,
} from '@ulangi/ulangi-common/interfaces';
import {
  IObservableArray,
  IObservableValue,
  action,
  computed,
  observable,
} from 'mobx';

import { ObservableSuggestion } from './ObservableSuggestion';

export class ObservableSuggestionListState {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  @observable
  public currentVocabularyText: string;

  @observable
  public suggestionList: null | IObservableArray<ObservableSuggestion>;

  @observable
  public attributions: null | IObservableArray<Attribution>;

  public readonly fetchState: IObservableValue<ActivityState>;

  public readonly fetchError: IObservableValue<undefined | ErrorCode>;

  @action
  public reset(currentVocabularyText: string): void {
    this.currentVocabularyText = currentVocabularyText;
    this.suggestionList = null;
    this.attributions = null;
    this.fetchState.set(ActivityState.INACTIVE);
    this.fetchError.set(undefined);
  }

  @computed
  public get currentVocabularyTerm(): string {
    return this.vocabularyExtraFieldParser.parse(this.currentVocabularyText)
      .vocabularyTerm;
  }

  @computed
  public get currentVocabularyExtraFields(): VocabularyExtraFields {
    return this.vocabularyExtraFieldParser.parse(this.currentVocabularyText)
      .extraFields;
  }

  public constructor(
    currentVocabularyText: string,
    suggestionList: null | IObservableArray<ObservableSuggestion>,
    attributions: null | IObservableArray<Attribution>,
    fetchState: IObservableValue<ActivityState>,
    fetchError: IObservableValue<undefined | ErrorCode>
  ) {
    this.currentVocabularyText = currentVocabularyText;
    this.suggestionList = suggestionList;
    this.attributions = attributions;
    this.fetchState = fetchState;
    this.fetchError = fetchError;
  }
}
