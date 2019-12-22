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
  ObservableSetStore,
  ObservableVocabulary,
  ObservableVocabularyListState,
  mergeList,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';

export class SearchVocabularyDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private vocabularyListState: ObservableVocabularyListState;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    vocabularyListState: ObservableVocabularyListState,
    analytics: AnalyticsAdapter
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.vocabularyListState = vocabularyListState;
    this.analytics = analytics;
  }

  public prepareAndSearch(searchTerm: string): void {
    this.analytics.logEvent('search_own_vocabulary');
    this.eventBus.pubsub(
      createAction(ActionType.SEARCH__PREPARE_SEARCH, {
        setId: this.setStore.existingCurrentSetId,
        searchTerm,
      }),
      group(
        on(
          ActionType.SEARCH__PREPARE_SEARCH,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.ACTIVE);
          }
        ),
        once(
          ActionType.SEARCH__PREPARE_SEARCH_SUCCEEDED,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
            this.search();
          }
        ),
        once(
          ActionType.SEARCH__PREPARE_SEARCH_FAILED,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
          }
        )
      )
    );
  }

  public search(): void {
    if (
      this.vocabularyListState.noMore === false &&
      this.vocabularyListState.fetchState.get() === ActivityState.INACTIVE
    ) {
      this.vocabularyListState.fetchState.set(ActivityState.ACTIVE);
      this.eventBus.pubsub(
        createAction(ActionType.SEARCH__SEARCH, null),
        group(
          once(
            ActionType.SEARCH__SEARCH_SUCCEEDED,
            ({ vocabularyList, noMore }): void => {
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
              this.vocabularyListState.noMore = noMore;
              this.vocabularyListState.vocabularyList = mergeList(
                this.vocabularyListState.vocabularyList,
                vocabularyList.map(
                  (vocabulary): [string, ObservableVocabulary] => {
                    return [
                      vocabulary.vocabularyId,
                      this.observableConverter.convertToObservableVocabulary(
                        vocabulary
                      ),
                    ];
                  }
                )
              );
            }
          ),
          once(
            ActionType.SEARCH__SEARCH_FAILED,
            (): void => {
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.fetchState.set(ActivityState.ERROR);
            }
          )
        )
      );
    }
  }

  public clearSearch(): void {
    this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
    this.vocabularyListState.vocabularyList = null;
    this.vocabularyListState.noMore = false;
    this.eventBus.publish(createAction(ActionType.SEARCH__CLEAR_SEARCH, null));
  }

  public refresh(searchTerm: string): void {
    this.vocabularyListState.isRefreshing.set(true);
    this.clearSearch();
    this.prepareAndSearch(searchTerm);
  }
}
