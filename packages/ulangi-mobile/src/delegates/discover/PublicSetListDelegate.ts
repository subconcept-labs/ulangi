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
  ObservablePublicSet,
  ObservablePublicSetListState,
  ObservableSetStore,
  mergeList,
} from '@ulangi/ulangi-observable';
import { AnalyticsAdapter } from '@ulangi/ulangi-saga';
import { IObservableValue } from 'mobx';

export class PublicSetListDelegate {
  private eventBus: EventBus;
  private observableConverter: ObservableConverter;
  private setStore: ObservableSetStore;
  private publicSetCount: IObservableValue<null | number>;
  private publicSetList: ObservablePublicSetListState;
  private analytics: AnalyticsAdapter;

  public constructor(
    eventBus: EventBus,
    observableConverter: ObservableConverter,
    setStore: ObservableSetStore,
    publicSetCount: IObservableValue<null | number>,
    publicSetList: ObservablePublicSetListState,
    analytics: AnalyticsAdapter,
  ) {
    this.eventBus = eventBus;
    this.observableConverter = observableConverter;
    this.setStore = setStore;
    this.publicSetCount = publicSetCount;
    this.publicSetList = publicSetList;
    this.analytics = analytics;
  }

  public getPublicSetCount(): void {
    if (
      this.setStore.existingCurrentSet.learningLanguageCode !== 'any' &&
      this.setStore.existingCurrentSet.translatedToLanguageCode !== 'any'
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.LIBRARY__GET_PUBLIC_SET_COUNT, {
          languageCodePair: this.setStore.existingCurrentSet.languageCodePair,
        }),
        group(
          on(
            ActionType.LIBRARY__GETTING_PUBLIC_SET_COUNT,
            (): void => {
              this.publicSetCount.set(null);
            },
          ),
          once(
            ActionType.LIBRARY__GET_PUBLIC_SET_COUNT_SUCCEEDED,
            ({ count }): void => {
              this.publicSetCount.set(count);
            },
          ),
          once(
            ActionType.LIBRARY__GET_PUBLIC_SET_COUNT_FAILED,
            (): void => {
              this.publicSetCount.set(null);
            },
          ),
        ),
      );
    }
  }

  public prepareAndSearch(searchTerm: string): void {
    this.analytics.logEvent('search_public_sets');
    if (
      this.setStore.existingCurrentSet.learningLanguageCode !== 'any' &&
      this.setStore.existingCurrentSet.translatedToLanguageCode !== 'any'
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS, {
          languageCodePair: this.setStore.existingCurrentSet.languageCodePair,
          searchTerm,
        }),
        group(
          on(
            ActionType.LIBRARY__PREPARING_SEARCH_PUBLIC_SETS,
            (): void => {
              this.publicSetList.searchState.set(ActivityState.ACTIVE);
            },
          ),
          once(
            ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS_SUCCEEDED,
            (): void => {
              this.publicSetList.searchState.set(ActivityState.INACTIVE);
              this.search();
            },
          ),
          once(
            ActionType.LIBRARY__PREPARE_SEARCH_PUBLIC_SETS_FAILED,
            (): void => {
              this.publicSetList.isRefreshing.set(false);
              this.publicSetList.searchState.set(ActivityState.ERROR);
            },
          ),
        ),
      );
    }
  }

  public search(): void {
    if (
      !this.publicSetList.noMore &&
      this.publicSetList.searchState.get() === ActivityState.INACTIVE
    ) {
      this.eventBus.pubsub(
        createAction(ActionType.LIBRARY__SEARCH_PUBLIC_SETS, null),
        group(
          on(
            ActionType.LIBRARY__SEARCHING_PUBLIC_SETS,
            (): void => {
              this.publicSetList.searchState.set(ActivityState.ACTIVE);
            },
          ),
          once(
            ActionType.LIBRARY__SEARCH_PUBLIC_SETS_SUCCEEDED,
            ({ setList, noMore }): void => {
              this.publicSetList.searchState.set(ActivityState.INACTIVE);
              this.publicSetList.isRefreshing.set(false);
              this.publicSetList.noMore = noMore;
              this.publicSetList.publicSetList = mergeList(
                this.publicSetList.publicSetList,
                setList.map(
                  (set): [string, ObservablePublicSet] => {
                    return [
                      set.publicSetId,
                      this.observableConverter.convertToObservablePublicSet(
                        set,
                      ),
                    ];
                  },
                ),
              );
            },
          ),
          once(
            ActionType.LIBRARY__SEARCH_PUBLIC_SETS_FAILED,
            (): void => {
              this.publicSetList.isRefreshing.set(false);
              this.publicSetList.searchState.set(ActivityState.ERROR);
            },
          ),
        ),
      );
    }
  }

  public clearSearch(): void {
    this.publicSetList.publicSetList = null;
    this.publicSetList.noMore = false;
    this.publicSetList.searchState.set(ActivityState.INACTIVE);
    this.publicSetList.isRefreshing.set(false);
    this.eventBus.publish(
      createAction(ActionType.LIBRARY__CLEAR_SEARCH_PUBLIC_SETS, null),
    );
  }

  public refresh(searchTerm: string): void {
    this.clearSearch();
    this.publicSetList.isRefreshing.set(true);
    this.prepareAndSearch(searchTerm);
  }
}
