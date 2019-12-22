/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { DeepPartial } from '@ulangi/extended-types';
import { ActionType, createAction } from '@ulangi/ulangi-action';
import { VocabularyBuilder } from '@ulangi/ulangi-common/builders';
import { Definition, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableVocabulary,
  ObservableVocabularyFormState,
} from '@ulangi/ulangi-observable';

export class AddVocabularyDelegate {
  private vocabularyBuilder = new VocabularyBuilder();

  private eventBus: EventBus;
  private observableConverter: ObservableConverter;
  private setStore: ObservableSetStore;
  private vocabularyFormState: ObservableVocabularyFormState;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    setStore: ObservableSetStore,
    vocabularyFormState: ObservableVocabularyFormState
  ) {
    this.eventBus = eventBus;
    this.observableConverter = observableConverter;
    this.setStore = setStore;
    this.vocabularyFormState = vocabularyFormState;
  }

  public saveAdd(callback: {
    onSaving: () => void;
    onSaveSucceeded: () => void;
    onSaveFailed: (errorCode: string) => void;
  }): void {
    const currentSetId = assertExists(
      this.setStore.currentSetId,
      'currentSetId should not be null or undefined'
    );

    const vocabulary = this.prepareVocabulary();

    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__ADD, {
        vocabulary,
        setId: currentSetId,
      }),
      group(
        on(ActionType.VOCABULARY__ADDING, callback.onSaving),
        once(ActionType.VOCABULARY__ADD_SUCCEEDED, callback.onSaveSucceeded),
        once(
          ActionType.VOCABULARY__ADD_FAILED,
          ({ errorCode }): void => {
            callback.onSaveFailed(errorCode);
          }
        )
      )
    );
  }

  public createPreview(): ObservableVocabulary {
    return this.observableConverter.convertToObservableVocabulary(
      this.prepareVocabulary()
    );
  }

  private prepareVocabulary(): Vocabulary {
    // Filter out definitions that user don't enter meaning
    const definitions = this.vocabularyFormState.definitions
      .map(
        (definition): DeepPartial<Definition> => {
          return {
            definitionId: definition.definitionId,
            wordClasses: definition.wordClasses.slice(),
            meaning: definition.meaning,
            source: definition.source,
          };
        }
      )
      .filter((definition): boolean => definition.meaning !== '');

    let category;
    if (this.vocabularyFormState.categoryName !== '') {
      category = {
        categoryName: this.vocabularyFormState.categoryName,
      };
    }

    return this.vocabularyBuilder.build({
      vocabularyId: this.vocabularyFormState.vocabularyId,
      vocabularyText: this.vocabularyFormState.vocabularyText,
      definitions,
      category,
    });
  }
}
