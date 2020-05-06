/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState, ErrorCode } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableDictionaryEntryState,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';

export class DictionaryEntryDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private dictionaryEntryState: ObservableDictionaryEntryState;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    dictionaryEntryState: ObservableDictionaryEntryState,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.dictionaryEntryState = dictionaryEntryState;
  }

  public getDictionaryEntry(term: string): void {
    if (
      this.setStore.existingCurrentSet.learningLanguageCode === 'any' ||
      this.setStore.existingCurrentSet.translatedToLanguageCode === 'any'
    ) {
      this.dictionaryEntryState.fetchState.set(ActivityState.ERROR);
      this.dictionaryEntryState.fetchError.set(
        ErrorCode.DICTIONARY__SPECIFIC_LANAGUAGE_REQUIRED,
      );
    } else if (this.setStore.existingCurrentSet.dictionaryAvailable === false) {
      this.dictionaryEntryState.fetchState.set(ActivityState.ERROR);
      this.dictionaryEntryState.fetchError.set(
        ErrorCode.DICTIONARY__UNSUPPORTED,
      );
    } else {
      this.eventBus.pubsub(
        createAction(ActionType.DICTIONARY__GET_ENTRY, {
          searchTerm: term,
          searchTermLanguageCode: this.setStore.existingCurrentSet
            .learningLanguageCode,
          translatedToLanguageCode: this.setStore.existingCurrentSet
            .translatedToLanguageCode,
        }),
        group(
          on(
            ActionType.DICTIONARY__GETTING_ENTRY,
            (): void => {
              this.dictionaryEntryState.fetchState.set(ActivityState.ACTIVE);
            },
          ),
          once(
            ActionType.DICTIONARY__GET_ENTRY_SUCCEEDED,
            ({ dictionaryEntry }): void => {
              this.dictionaryEntryState.fetchState.set(ActivityState.INACTIVE);
              this.dictionaryEntryState.dictionaryEntry = this.observableConverter.convertToObservableDictionaryEntry(
                dictionaryEntry,
              );
            },
          ),
          once(
            ActionType.DICTIONARY__GET_ENTRY_FAILED,
            (errorBag): void => {
              this.dictionaryEntryState.fetchState.set(ActivityState.ERROR);
              this.dictionaryEntryState.fetchError.set(errorBag.errorCode);
            },
          ),
        ),
      );
    }
  }

  public clearDictionaryEntry(): void {
    this.dictionaryEntryState.fetchState.set(ActivityState.INACTIVE);
    this.dictionaryEntryState.dictionaryEntry = null;
    this.eventBus.publish(
      createAction(ActionType.DICTIONARY__CLEAR_ENTRY, null),
    );
  }
}
