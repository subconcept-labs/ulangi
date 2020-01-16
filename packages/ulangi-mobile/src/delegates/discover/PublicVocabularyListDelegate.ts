/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import { ActivityState } from '@ulangi/ulangi-common/enums';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservablePublicVocabulary,
  ObservablePublicVocabularyListState,
  ObservableSetStore,
  mergeList,
} from '@ulangi/ulangi-observable';

import { RemoteLogger } from '../../RemoteLogger';

export class PublicVocabularyListDelegate {
  private eventBus: EventBus;
  private observableConverter: ObservableConverter;
  private setStore: ObservableSetStore;
  private vocabularyListState: ObservablePublicVocabularyListState;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    setStore: ObservableSetStore,
    vocabularyListState: ObservablePublicVocabularyListState,
  ) {
    this.eventBus = eventBus;
    this.observableConverter = observableConverter;
    this.setStore = setStore;
    this.vocabularyListState = vocabularyListState;
  }

  public prepareAndSearch(searchTerm: string): void {
    RemoteLogger.logEvent('search_dictionary');
    if (
      this.setStore.existingCurrentSet.learningLanguageCode !== 'any' &&
      this.setStore.existingCurrentSet.translatedToLanguageCode !== 'any'
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY, {
          languageCodePair: this.setStore.existingCurrentSet.languageCodePair,
          searchTerm,
        }),
        group(
          on(
            ActionType.LIBRARY__PREPARING_SEARCH_PUBLIC_VOCABULARY,
            (): void => {
              this.vocabularyListState.searchState.set(ActivityState.ACTIVE);
            },
          ),
          once(
            ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_VOCABULARY_SUCCEEDED,
            (): void => {
              this.vocabularyListState.searchState.set(ActivityState.INACTIVE);
              this.search();
            },
          ),
          once(
            ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS_FAILED,
            (): void => {
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.searchState.set(ActivityState.ERROR);
            },
          ),
        ),
      );
    }
  }

  public search(): void {
    if (
      !this.vocabularyListState.noMore &&
      this.vocabularyListState.searchState.get() === ActivityState.INACTIVE
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.LIBRARY__SEARCH_PUBLIC_VOCABULARY, null),
        group(
          on(
            ActionType.LIBRARY__SEARCHING_PUBLIC_VOCABULARY,
            (): void => {
              this.vocabularyListState.searchState.set(ActivityState.ACTIVE);
            },
          ),
          once(
            ActionType.LIBRARY__SEARCH_PUBLIC_VOCABULARY_SUCCEEDED,
            ({ vocabularyList, noMore }): void => {
              this.vocabularyListState.searchState.set(ActivityState.INACTIVE);
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.noMore = noMore;
              this.vocabularyListState.publicVocabularyList = mergeList(
                this.vocabularyListState.publicVocabularyList,
                vocabularyList.map(
                  (vocabulary): [string, ObservablePublicVocabulary] => {
                    return [
                      vocabulary.publicVocabularyId,
                      this.observableConverter.convertToObservablePublicVocabulary(
                        vocabulary,
                      ),
                    ];
                  },
                ),
              );
            },
          ),
          once(
            ActionType.LIBRARY__SEARCH_PUBLIC_VOCABULARY_FAILED,
            (): void => {
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.searchState.set(ActivityState.ERROR);
            },
          ),
        ),
      );
    }
  }

  public clearSearch(): void {
    this.vocabularyListState.publicVocabularyList = null;
    this.vocabularyListState.noMore = false;
    this.vocabularyListState.searchState.set(ActivityState.INACTIVE);
    this.vocabularyListState.isRefreshing.set(false);
    this.eventBus.publish(
      createAction(ActionType.LIBRARY__CLEAR_SEARCH_PUBLIC_VOCABULARY, null),
    );
  }

  public refresh(searchTerm: string): void {
    this.clearSearch();
    this.vocabularyListState.isRefreshing.set(true);
    this.prepareAndSearch(searchTerm);
  }
}
