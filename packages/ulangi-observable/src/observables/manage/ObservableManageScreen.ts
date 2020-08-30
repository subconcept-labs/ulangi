/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  CategorySortType,
  ScreenName,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableCategoryListState } from '../category/ObservableCategoryListState';
import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';

export class ObservableManageScreen extends ObservableScreen {
  @observable
  public screenAppearedTimes: number;

  public readonly selectedLayout: IObservableValue<'table' | 'list'>
    
  public readonly selectedSortType: IObservableValue<CategorySortType>;

  public readonly selectedVocabularyStatus: IObservableValue<VocabularyStatus>;

  public readonly categoryListState: ObservableCategoryListState;

  public constructor(
    screenAppearedTimes: number,
    selectedLayout: IObservableValue<'table' | 'list'>,
    selectedSortType: IObservableValue<CategorySortType>,
    selectedVocabularyStatus: IObservableValue<VocabularyStatus>,
    categoryListState: ObservableCategoryListState,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTouchableTopBar
  ) {
    super(componentId, screenName, topBar);
    this.screenAppearedTimes = screenAppearedTimes;
    this.selectedLayout = selectedLayout;
    this.selectedSortType = selectedSortType;
    this.selectedVocabularyStatus = selectedVocabularyStatus;
    this.categoryListState = categoryListState;
  }
}
