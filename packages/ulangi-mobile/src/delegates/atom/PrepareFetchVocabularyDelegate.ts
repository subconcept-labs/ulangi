/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ErrorBag } from '@ulangi/ulangi-common/interfaces';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableAtomScreen,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';

export class PrepareFetchVocabularyDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableScreen: ObservableAtomScreen;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableScreen: ObservableAtomScreen,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableScreen = observableScreen;
  }

  public prepareFetch(callback: {
    onPreparing: () => void;
    onPrepareSucceeded: () => void;
    onPrepareFailed: (errorBag: ErrorBag) => void;
  }): void {
    this.eventBus.pubsub(
      createAction(ActionType.ATOM__PREPARE_FETCH_VOCABULARY, {
        setId: this.setStore.existingCurrentSetId,
        selectedCategoryNames:
          typeof this.observableScreen.selectedCategoryNames !== 'undefined'
            ? this.observableScreen.selectedCategoryNames.slice()
            : undefined,
      }),
      group(
        on(ActionType.ATOM__PREPARING_FETCH_VOCABULARY, callback.onPreparing),
        once(
          ActionType.ATOM__PREPARE_FETCH_VOCABULARY_SUCCEEDED,
          callback.onPrepareSucceeded,
        ),
        once(
          ActionType.ATOM__PREPARE_FETCH_VOCABULARY_FAILED,
          (errorBag): void => callback.onPrepareFailed(errorBag),
        ),
      ),
    );
  }
}
