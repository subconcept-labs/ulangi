/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActionType, createAction } from '@ulangi/ulangi-action';
import {
  ActivityState,
  CategorySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { CategoryFilterCondition } from '@ulangi/ulangi-common/types';
import { EventBus, group, on, once } from '@ulangi/ulangi-event';
import {
  ObservableCategory,
  ObservableCategoryListState,
  ObservableConverter,
  ObservableSetStore,
  mergeList,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

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
    writingSettingsDelegate: WritingSettingsDelegate
  ) {
    this.eventBus = eventBus;
    this.setStore = setStore;
    this.observableConverter = observableConverter;
    this.categoryListState = categoryListState;
    this.spacedRepetitionSettingsDelegate = spacedRepetitionSettingsDelegate;
    this.writingSettingsDelegate = writingSettingsDelegate;
  }

  public prepareAndFetch(
    vocabularyStatus: VocabularyStatus,
    sortType: CategorySortType
  ): void {
    this.eventBus.pubsub(
      createAction(
        ActionType.MANAGE__PREPARE_FETCH_CATEGORY,
        this.createPrepareFetchPayload(vocabularyStatus, sortType)
      ),
      group(
        on(
          ActionType.MANAGE__PREPARING_FETCH_CATEGORY,
          (): void => {
            this.categoryListState.fetchState.set(ActivityState.ACTIVE);
          }
        ),
        once(
          ActionType.MANAGE__PREPARE_FETCH_CATEGORY_SUCCEEDED,
          (): void => {
            this.categoryListState.fetchState.set(ActivityState.INACTIVE);
            this.fetch(vocabularyStatus === VocabularyStatus.ACTIVE);
          }
        ),
        once(
          ActionType.MANAGE__PREPARE_FETCH_CATEGORY_FAILED,
          (): void => {
            this.categoryListState.fetchState.set(ActivityState.INACTIVE);
          }
        )
      )
    );
  }

  public refresh(
    vocabularyStatus: VocabularyStatus,
    sortType: CategorySortType
  ): void {
    this.categoryListState.isRefreshing.set(true);
    this.categoryListState.shouldShowRefreshNotice.set(false);
    this.clearFetch();
    this.prepareAndFetch(vocabularyStatus, sortType);
  }

  public fetch(shouldFetchDueAndNewCount: boolean): void {
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
                        category
                      ),
                    ];
                  }
                )
              );

              if (shouldFetchDueAndNewCount) {
                const categoryNames = categoryList.map(
                  (category): string => {
                    return category.categoryName;
                  }
                );

                this.fetchSpacedRepetitionDueAndNewCounts(categoryNames);
                this.fetchWritingDueAndNewCounts(categoryNames);
              }
            }
          ),
          once(
            ActionType.MANAGE__FETCH_CATEGORY_FAILED,
            (): void => {
              this.categoryListState.fetchState.set(ActivityState.ERROR);
              this.categoryListState.isRefreshing.set(false);
            }
          )
        )
      );
    }
  }

  public clearFetch(): void {
    this.categoryListState.fetchState.set(ActivityState.INACTIVE);
    this.categoryListState.categoryList = null;
    this.categoryListState.noMore = false;
    this.eventBus.publish(
      createAction(ActionType.MANAGE__CLEAR_FETCH_CATEGORY, null)
    );
  }

  public refreshIfEmpty(
    vocabularyStatus: VocabularyStatus,
    sortType: CategorySortType
  ): void {
    if (
      this.categoryListState.categoryList !== null &&
      this.categoryListState.categoryList.size === 0
    ) {
      this.refresh(vocabularyStatus, sortType);
    }
  }

  private createPrepareFetchPayload(
    vocabularyStatus: VocabularyStatus,
    sortType: CategorySortType
  ): {
    filterCondition: CategoryFilterCondition;
    sortType: CategorySortType;
  } {
    return {
      filterCondition: {
        filterBy: 'VocabularyStatus',
        setId: this.setStore.existingCurrentSetId,
        vocabularyStatus,
      },
      sortType,
    };
  }

  public autoUpdateSpacedRepetitionDueAndNewCounts(): void {
    this.eventBus.subscribe(
      on(
        ActionType.MANAGE__FETCH_SPACED_REPETITION_DUE_AND_NEW_COUNTS_SUCCEEDED,
        (countsPerCategoryName): void => {
          _.toPairs(countsPerCategoryName).forEach(
            ([categoryName, counts]): void => {
              if (this.categoryListState.categoryList !== null) {
                const category = this.categoryListState.categoryList.get(
                  categoryName
                );

                if (typeof category !== 'undefined') {
                  category.spacedRepetitionCounts = counts;
                }
              }
            }
          );
        }
      )
    );
  }

  public autoUpdateWritingDueAndNewCounts(): void {
    this.eventBus.subscribe(
      on(
        ActionType.MANAGE__FETCH_WRITING_DUE_AND_NEW_COUNTS_SUCCEEDED,
        (countsPerCategoryName): void => {
          _.toPairs(countsPerCategoryName).forEach(
            ([categoryName, counts]): void => {
              if (this.categoryListState.categoryList !== null) {
                const category = this.categoryListState.categoryList.get(
                  categoryName
                );

                if (typeof category !== 'undefined') {
                  category.writingCounts = counts;
                }
              }
            }
          );
        }
      )
    );
  }

  private fetchSpacedRepetitionDueAndNewCounts(categoryNames: string[]): void {
    const {
      initialInterval,
    } = this.spacedRepetitionSettingsDelegate.getCurrentSettings();

    this.eventBus.publish(
      createAction(
        ActionType.MANAGE__FETCH_SPACED_REPETITION_DUE_AND_NEW_COUNTS,
        {
          setId: this.setStore.existingCurrentSet.setId,
          initialInterval,
          categoryNames,
        }
      )
    );
  }

  private fetchWritingDueAndNewCounts(categoryNames: string[]): void {
    const {
      initialInterval,
    } = this.writingSettingsDelegate.getCurrentSettings();

    this.eventBus.publish(
      createAction(ActionType.MANAGE__FETCH_WRITING_DUE_AND_NEW_COUNTS, {
        setId: this.setStore.existingCurrentSet.setId,
        initialInterval,
        categoryNames,
      })
    );
  }
}
