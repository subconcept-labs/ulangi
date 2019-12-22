/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import * as _ from 'lodash';
import {
  IObservableArray,
  IObservableValue,
  action,
  computed,
  observable,
} from 'mobx';
import * as uuid from 'uuid';

import { ObservableDefinition } from './ObservableDefinition';

export class ObservableVocabularyFormState {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  @observable
  public vocabularyId: string;

  @observable
  public vocabularyText: string;

  @observable
  public definitions: IObservableArray<ObservableDefinition>;

  @observable
  public shouldFocusVocabularyInput: boolean;

  @observable
  public shouldMoveCursorOfVocabularyInput: null | number;

  @observable
  public readonly shouldFocusDefinitionInput: IObservableValue<null | number>;

  @observable
  public readonly shouldMoveCursorOfDefinitionInput: IObservableValue<null | {
    index: number;
    position: number;
  }>;

  @observable
  public categoryName: string;

  @computed
  public get vocabularyTerm(): string {
    return this.vocabularyExtraFieldParser.parse(this.vocabularyText)
      .vocabularyTerm;
  }

  @computed
  public get areAllDefinitionsEmpty(): boolean {
    return _.every(
      this.definitions,
      (definition): boolean => definition.meaning === ''
    );
  }

  @action
  public setDefinitions(definitions: readonly ObservableDefinition[]): void {
    this.definitions = observable(definitions.slice());
  }

  @action
  public reset(): void {
    this.vocabularyId = uuid.v4();
    this.vocabularyText = '';
    this.definitions.clear();
    this.shouldFocusVocabularyInput = false;
    this.shouldMoveCursorOfVocabularyInput = null;
    this.shouldFocusDefinitionInput.set(null);
    this.shouldMoveCursorOfDefinitionInput.set(null);
  }

  public constructor(
    vocabularyId: string,
    vocabularyText: string,
    definitions: IObservableArray<ObservableDefinition>,
    shouldFocusVocabularyInput: boolean,
    shouldMoveCursorOfVocabularyInput: null | number,
    shouldFocusDefinitionInput: IObservableValue<null | number>,
    shouldMoveCursorOfDefinitionInput: IObservableValue<null | {
      index: number;
      position: number;
    }>,
    categoryName: string
  ) {
    this.vocabularyId = vocabularyId;
    this.vocabularyText = vocabularyText;
    this.definitions = definitions;
    this.shouldFocusVocabularyInput = shouldFocusVocabularyInput;
    this.shouldMoveCursorOfVocabularyInput = shouldMoveCursorOfVocabularyInput;
    this.shouldFocusDefinitionInput = shouldFocusDefinitionInput;
    this.shouldMoveCursorOfDefinitionInput = shouldMoveCursorOfDefinitionInput;
    this.categoryName = categoryName;
  }
}
