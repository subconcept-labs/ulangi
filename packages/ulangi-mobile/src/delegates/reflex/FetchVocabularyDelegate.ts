/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableReflexScreen,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { config } from '../../constants/config';
import { ReflexQuestionIterator } from '../../iterators/ReflexQuestionIterator';

export class FetchVocabularyDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableReflexScreen;
  private questionIterator: ReflexQuestionIterator;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableScreen: ObservableReflexScreen,
    questionIterator: ReflexQuestionIterator,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
    this.questionIterator = questionIterator;
  }

  public prepareFetch(callback: {
    onPreparing: () => void;
    onPrepareSucceeded: () => void;
    onPrepareFailed: (errorBag: ErrorBag) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.REFLEX__PREPARE_FETCH_VOCABULARY, {
        setId: this.setStore.existingCurrentSetId,
        selectedCategoryNames:
          typeof this.observableScreen.selectedCategoryNames !== 'undefined'
            ? this.observableScreen.selectedCategoryNames.slice()
            : undefined,
      }),
      group(
        on(ActionType.REFLEX__PREPARING_FETCH_VOCABULARY, callback.onPreparing),
        once(
          ActionType.REFLEX__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
          callback.onPrepareSucceeded,
        ),
        once(
          ActionType.REFLEX__PREPARE_FETCH_VOCABULARY_FAILED,
          (errorBag): void => callback.onPrepareFailed(errorBag),
        ),
      ),
    );
  }

  public fetch(callback: {
    onFetchSucceeded: (
      vocabularyList: readonly Vocabulary[],
      noMore: boolean,
    ) => void;
    onFetchFailed: (errorBag: ErrorBag) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.REFLEX__FETCH_VOCABULARY, null),
      group(
        once(
          ActionType.REFLEX__FETCH_VOCABULARY_SUCCEEDED,
          ({ vocabularyList, noMore }): void =>
            callback.onFetchSucceeded(vocabularyList, noMore),
        ),
        once(
          ActionType.REFLEX__FETCH_VOCABULARY_FAILED,
          (errorBag): void => callback.onFetchFailed(errorBag),
        ),
      ),
    );
  }

  public fetchVocabularyIfBelowThreshold(callback: {
    onFetchSucceeded: (
      vocabularyList: readonly Vocabulary[],
      noMore: boolean,
    ) => void;
  }): void {
    if (
      this.questionIterator.getNumberOfQuestionLeft() <
      config.reflex.fetchTriggerThreshold
    ) {
      this.fetch({
        onFetchSucceeded: callback.onFetchSucceeded,
        onFetchFailed: _.noop,
      });
    }
  }

  public clearFetch(): void {
    this.eventBus.publish(
      createAction(ActionType.REFLEX__CLEAR_FETCH_VOCABULARY, null),
    );
  }
}
