/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  CategorySortType,
  ScreenName,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableCategoryListState } from '../category/ObservableCategoryListState';
import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';

export class ObservableManageScreen extends ObservableScreen {
  @observable
  public screenAppearedTimes: number;

  public readonly selectedSortType: IObservableValue<CategorySortType>;

  public readonly selectedFilterType: IObservableValue<VocabularyFilterType>;

  public readonly categoryListState: ObservableCategoryListState;

  public constructor(
    screenAppearedTimes: number,
    selectedSortType: IObservableValue<CategorySortType>,
    selectedFilterType: IObservableValue<VocabularyFilterType>,
    categoryListState: ObservableCategoryListState,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTouchableTopBar
  ) {
    super(componentId, screenName, topBar);
    this.screenAppearedTimes = screenAppearedTimes;
    this.selectedSortType = selectedSortType;
    this.selectedFilterType = selectedFilterType;
    this.categoryListState = categoryListState;
  }
}
