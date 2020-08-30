/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ActivityState } from '@ulangi/ulangi-common/enums';
import { IObservableValue, ObservableMap, computed, observable } from 'mobx';

import { ObservableCategory } from '../category/ObservableCategory';

export class ObservableCategoryListState {
  @observable
  public categoryList: null | ObservableMap<string, ObservableCategory>;

  @observable
  public noMore: boolean;

  public readonly fetchState: IObservableValue<ActivityState>;

  public readonly shouldShowSyncingNotice: IObservableValue<boolean>;

  public readonly shouldShowRefreshNotice: IObservableValue<boolean>;

  public readonly isRefreshing: IObservableValue<boolean>;

  public readonly isSelectionModeOn: IObservableValue<boolean>;

  @computed
  public get selectedCategoryNames(): string[] {
    if (this.categoryList !== null) {
      return Array.from(this.categoryList.values())
        .filter(
          (category): boolean => {
            return category.isSelected.get() === true;
          }
        )
        .map((category): string => category.categoryName);
    } else {
      return [];
    }
  }

  @computed
  public get numOfCategoriesSelected(): number {
    return this.selectedCategoryNames.length;
  }

  @computed
  public get areAllSelected(): boolean {
    if (this.categoryList === null) {
      return false
    } else {
      return this.categoryList.size === this.numOfCategoriesSelected
    }
  }

  @computed
  public get isPartiallySelected(): boolean {
    if (this.categoryList === null) {
      return false
    } else {
      return this.numOfCategoriesSelected !== 0
        && this.numOfCategoriesSelected < this.categoryList.size
    }
  }

  public constructor(
    categoryList: null | ObservableMap<string, ObservableCategory>,
    noMore: boolean,
    fetchState: IObservableValue<ActivityState>,
    shouldShowSyncingNotice: IObservableValue<boolean>,
    shouldShowRefreshNotice: IObservableValue<boolean>,
    isSelectionModeOn: IObservableValue<boolean>,
    isRefreshing: IObservableValue<boolean>
  ) {
    this.categoryList = categoryList;
    this.noMore = noMore;
    this.fetchState = fetchState;
    this.shouldShowSyncingNotice = shouldShowSyncingNotice;
    this.shouldShowRefreshNotice = shouldShowRefreshNotice;
    this.isRefreshing = isRefreshing;
    this.isSelectionModeOn = isSelectionModeOn;
  }
}
