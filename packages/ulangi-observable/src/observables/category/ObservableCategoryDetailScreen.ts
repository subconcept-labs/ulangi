/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ScreenName,
  VocabularySortType,
  VocabularyStatus,
} from '@ulangi/ulangi-common/enums';
import { IObservableValue } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableVocabularyListState } from '../vocabulary/ObservableVocabularyListState';
import { ObservableCategory } from './ObservableCategory';

export class ObservableCategoryDetailScreen extends ObservableScreen {
  public readonly category: ObservableCategory;

  public readonly selectedVocabularyStatus: IObservableValue<VocabularyStatus>;

  public readonly selectedSortType: IObservableValue<VocabularySortType>;

  public readonly vocabularyListState: ObservableVocabularyListState;

  public constructor(
    category: ObservableCategory,
    selectedVocabularyStatus: IObservableValue<VocabularyStatus>,
    selectedSortType: IObservableValue<VocabularySortType>,
    vocabularyListState: ObservableVocabularyListState,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.category = category;
    this.selectedVocabularyStatus = selectedVocabularyStatus;
    this.selectedSortType = selectedSortType;
    this.vocabularyListState = vocabularyListState;
  }
}
