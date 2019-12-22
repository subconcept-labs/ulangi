/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ManageListType,
  ScreenName,
  VocabularyFilterType,
} from '@ulangi/ulangi-common/enums';
import { ScreenTitle } from '@ulangi/ulangi-common/interfaces';
import { IObservableValue } from 'mobx';

import { ObservableCategoryListState } from '../category/ObservableCategoryListState';
import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableVocabularyListState } from '../vocabulary/ObservableVocabularyListState';

export class ObservableManageScreen extends ObservableScreen {
  public readonly manageListType: IObservableValue<ManageListType>;

  public readonly selectedFilterType: IObservableValue<VocabularyFilterType>;

  public readonly vocabularyListState: ObservableVocabularyListState;

  public readonly categoryListState: ObservableCategoryListState;

  public constructor(
    manageListType: IObservableValue<ManageListType>,
    selectedFilterType: IObservableValue<VocabularyFilterType>,
    vocabularyListState: ObservableVocabularyListState,
    categoryListState: ObservableCategoryListState,
    screenName: ScreenName,
    screenTitle: ScreenTitle
  ) {
    super(screenName, screenTitle);
    this.manageListType = manageListType;
    this.selectedFilterType = selectedFilterType;
    this.vocabularyListState = vocabularyListState;
    this.categoryListState = categoryListState;
  }
}
