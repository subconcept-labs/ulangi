/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ActivityState,
  VocabularyDueType,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import { VocabularyFilterCondition } from '@ulangi/ulangi-common/types';
import {
  isVocabularyDueType,
  isVocabularyStatus,
} from '@ulangi/ulangi-common/utils';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableCategory,
  ObservableCategoryListState,
  ObservableConverter,
  ObservableSetStore,
  mergeList,
} from '@ulangi/ulangi-observable';

import { SpacedRepetitionSettingsDelegate } from '../../delegates/spaced-repetition/SpacedRepetitionSettingsDelegate';
import { WritingSettingsDelegate } from '../../delegates/writing/WritingSettingsDelegate';

export class CategoryListDelegate {
  private eventBus: EventBus;
  private setStore: ObservableSetStore;
  private observableConverter: ObservableConverter;
  private categoryListState: ObservableCategoryListState;
  private spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate;
  private writingSettingsDelegate: WritingSettingsDelegate;

  public constructor(
    eventBus: EventBus,
    setStore: ObservableSetStore,
    observableConverter: ObservableConverter,
    categoryListState: ObservableCategoryListState,
    spacedRepetitionSettingsDelegate: SpacedRepetitionSettingsDelegate,
    writingSettingsDelegate: WritingSettingsDelegate,
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.categoryListState = categoryListState;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
  }

  public prepareAndFetch(filterType: VocabularyFilterType): void {
    this.eventBus.pubsub(
      createAction(
        ActionType.MANAGE__PREPARE_FETCH_CATEGORY,
        this.createPrepareFetchPayload(filterType),
      ),
      group(
        on(
          ActionType.MANAGE__PREPARING_FETCH_CATEGORY,
          (): void => {
            this.categoryListState.fetchState.set(ActivityState.ACTIVE);
          },
        ),
        once(
          ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED,
          (): void => {
            this.categoryListState.fetchState.set(ActivityState.INACTIVE);
            this.fetch();
          },
        ),
        once(
          ActionType.MANAGE__PREPARE_FETCH_CATEGORY_FAILED,
          (): void => {
            this.categoryListState.fetchState.set(ActivityState.INACTIVE);
          },
        ),
      ),
    );
  }

  public refresh(filterType: VocabularyFilterType): void {
    this.categoryListState.isRefreshing.set(true);
    this.categoryListState.shouldShowRefreshNotice.set(false);
    this.clearFetch();
    this.prepareAndFetch(filterType);
  }

  public fetch(): void {
    if (
      this.categoryListState.noMore === false &&
      this.categoryListState.fetchState.get() === ActivityState.INACTIVE
    ) {
      this.categoryListState.fetchState.set(ActivityState.ACTIVE);
      this.eventBus.pubsub(
        createAction(ActionType.MANAGE__FETCH_CATEGORY, null),
        group(
          once(
            ActionType.MANAGE__FETCH_CATEGORY_SUCCEEDED,
            ({ categoryList, noMore }): void => {
              this.categoryListState.fetchState.set(ActivityState.INACTIVE);
              this.categoryListState.isRefreshing.set(false);
              this.categoryListState.noMore = noMore;
              this.categoryListState.categoryList = mergeList(
                this.categoryListState.categoryList,
                categoryList.map(
                  (category): [string, ObservableCategory] => {
                    return [
                      category.categoryName,
                      this.observableConverter.convertToObservableCategory(
                        category,
                      ),
                    ];
                  },
                ),
              );
            },
          ),
          once(
            ActionType.MANAGE__FETCH_CATEGORY_FAILED,
            (): void => {
              this.categoryListState.fetchState.set(ActivityState.ERROR);
              this.categoryListState.isRefreshing.set(false);
            },
          ),
        ),
      );
    }
  }

  public clearFetch(): void {
    this.categoryListState.fetchState.set(ActivityState.INACTIVE);
    this.categoryListState.categoryList = null;
    this.categoryListState.noMore = false;
    this.eventBus.publish(
      createAction(ActionType.MANAGE__CLEAR_FETCH_CATEGORY, null),
    );
  }

  public refreshIfEmpty(filterType: VocabularyFilterType): void {
    if (
      this.categoryListState.categoryList !== null &&
      this.categoryListState.categoryList.size === 0
    ) {
      this.refresh(filterType);
    }
  }

  private createPrepareFetchPayload(
    filterType: VocabularyFilterType,
  ): VocabularyFilterCondition {
    if (isVocabularyStatus(filterType)) {
      return {
        filterBy: 'VocabularyStatus',
        setId: this.setStore.existingCurrentSetId,
        vocabularyStatus: filterType,
        categoryNames: undefined,
      };
    } else if (isVocabularyDueType(filterType)) {
      return {
        filterBy: 'VocabularyDueType',
        setId: this.setStore.existingCurrentSetId,
        initialInterval:
          filterType === VocabularyDueType.DUE_BY_SPACED_REPETITION
            ? this.spacedRepetitionSettingsDelegate.getCurrentSettings()
                .initialInterval
            : this.writingSettingsDelegate.getCurrentSettings().initialInterval,
        dueType: filterType,
        categoryNames: undefined,
      };
    } else {
      throw new Error('Invalid filter type');
    }
  }
}
