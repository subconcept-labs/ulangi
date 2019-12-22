/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType } from '@ulangi/ulangi-action';
import { VocabularyCategory } from '@ulangi/ulangi-common/interfaces';
import { EventBus, on } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableVocabularyListState,
} from '@ulangi/ulangi-observable';

export class VocabularyLiveUpdateDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private vocabularyListState: ObservableVocabularyListState;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    vocabularyListState: ObservableVocabularyListState
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.vocabularyListState = vocabularyListState;
  }

  public autoUpdateEditedVocabulary(
    removeWhenVocabularyStatusChange: boolean,
    removeWhenCategoryChange: boolean
  ): void {
    this.eventBus.subscribe(
      on(
        ActionType.VOCABULARY__EDIT_SUCCEEDED,
        ({ vocabulary, setId }): void => {
          if (this.vocabularyListState.vocabularyList !== null) {
            const oldVocabulary = this.vocabularyListState.vocabularyList.get(
              vocabulary.vocabularyId
            );

            if (typeof oldVocabulary !== 'undefined') {
              if (
                // remove when setId change
                (typeof setId !== 'undefined' &&
                  this.setStore.currentSetId !== setId) ||
                (removeWhenVocabularyStatusChange === true &&
                  oldVocabulary.vocabularyStatus !==
                    vocabulary.vocabularyStatus) ||
                (removeWhenCategoryChange === true &&
                  this.isCategoryChanged(
                    vocabulary.category,
                    oldVocabulary.category
                  ))
              ) {
                this.vocabularyListState.vocabularyList.delete(
                  vocabulary.vocabularyId
                );
              } else {
                this.vocabularyListState.vocabularyList.set(
                  vocabulary.vocabularyId,
                  this.observableConverter.convertToObservableVocabulary(
                    vocabulary
                  )
                );
              }
            }
          }
        }
      )
    );
  }

  private isCategoryChanged(
    newCategory: undefined | VocabularyCategory,
    oldCategory: undefined | VocabularyCategory
  ): boolean {
    if (
      (typeof newCategory === 'undefined' ||
        newCategory.categoryName === 'Uncategorized') &&
      (typeof oldCategory === 'undefined' ||
        oldCategory.categoryName === 'Uncategorized')
    ) {
      return false;
    } else if (
      typeof newCategory !== 'undefined' &&
      typeof oldCategory !== 'undefined' &&
      newCategory.categoryName !== oldCategory.categoryName
    ) {
      return true;
    } else {
      return false;
    }
  }
}
