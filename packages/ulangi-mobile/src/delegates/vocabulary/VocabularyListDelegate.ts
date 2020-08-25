/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ActivityState,
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { VocabularyFilterCondition } from '@ulangi/ulangi-common/types';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableConverter,
  ObservableSetStore,
  ObservableVocabulary,
  ObservableVocabularyListState,
  mergeList,
} from '@ulangi/ulangi-observable';

export class VocabularyListDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private vocabularyListState: ObservableVocabularyListState;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    vocabularyListState: ObservableVocabularyListState,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.vocabularyListState = vocabularyListState;
  }

  public prepareAndFetch(
    vocabularyStatus: VocabularyStatus,
    sortType: VocabularySortType,
    categoryNames?: undefined | string[],
  ): void {
    this.eventBus.pubsub(
      createAction(ActionType.VOCABULARY__PREPARE_FETCH, {
        filterCondition: this.createFilterCondition(
          vocabularyStatus,
          categoryNames,
        ),
        sortType,
      }),
      group(
        on(
          ActionType.VOCABULARY__PREPARING_FETCH,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.ACTIVE);
          },
        ),
        once(
          ActionType.VOCABULARY__PREPARE_FETCH_SUCCEEDED,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
            this.fetch();
          },
        ),
        once(
          ActionType.VOCABULARY__PREPARE_FETCH_FAILED,
          (): void => {
            this.vocabularyListState.fetchState.set(ActivityState.ERROR);
          },
        ),
      ),
    );
  }

  public refresh(
    vocabularyStatus: VocabularyStatus,
    sortType: VocabularySortType,
    categoryNames?: undefined | string[],
  ): void {
    this.vocabularyListState.isRefreshing.set(true);
    this.vocabularyListState.shouldShowRefreshNotice.set(false);
    this.clearFetch();
    this.prepareAndFetch(vocabularyStatus, sortType, categoryNames);
  }

  public fetch(): void {
    if (
      this.vocabularyListState.noMore === false &&
      this.vocabularyListState.fetchState.get() === ActivityState.INACTIVE
    ) {
      this.vocabularyListState.fetchState.set(ActivityState.ACTIVE);
      this.eventBus.pubsub(
        createAction(ActionType.VOCABULARY__FETCH, null),
        group(
          once(
            ActionType.VOCABULARY__FETCH_SUCCEEDED,
            ({ vocabularyList, noMore }): void => {
              this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
              this.vocabularyListState.isRefreshing.set(false);
              this.vocabularyListState.noMore = noMore;
              this.vocabularyListState.vocabularyList = mergeList(
                this.vocabularyListState.vocabularyList,
                vocabularyList.map(
                  (vocabulary): [string, ObservableVocabulary] => [
                    vocabulary.vocabularyId,
                    this.observableConverter.convertToObservableVocabulary(
                      vocabulary,
                    ),
                  ],
                ),
              );
            },
          ),
          once(
            ActionType.VOCABULARY__FETCH_FAILED,
            (): void => {
              this.vocabularyListState.fetchState.set(ActivityState.ERROR);
              this.vocabularyListState.isRefreshing.set(false);
            },
          ),
        ),
      );
    }
  }

  public clearFetch(): void {
    this.vocabularyListState.fetchState.set(ActivityState.INACTIVE);
    this.vocabularyListState.vocabularyList = null;
    this.vocabularyListState.noMore = false;
    this.eventBus.publish(
      createAction(ActionType.VOCABULARY__CLEAR_FETCH, null),
    );
  }

  public refreshIfEmpty(
    vocabularyStatus: VocabularyStatus,
    sortType: VocabularySortType,
    categoryNames?: undefined | string[],
  ): void {
    if (
      this.vocabularyListState.vocabularyList !== null &&
      this.vocabularyListState.vocabularyList.size === 0
    ) {
      this.refresh(vocabularyStatus, sortType, categoryNames);
    }
  }

  private createFilterCondition(
    vocabularyStatus: VocabularyStatus,
    categoryNames?: undefined | string[],
  ): VocabularyFilterCondition {
    return {
      filterBy: 'VocabularyStatus',
      setId: this.setStore.existingCurrentSetId,
      vocabularyStatus: vocabularyStatus,
      categoryNames,
    };
  }
}
