/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';
import { ObservableVocabularyListState } from '../vocabulary/ObservableVocabularyListState';

export class ObservableSearchScreen extends ObservableScreen {
  @observable
  public searchInput: string;

  public readonly vocabularyListState: ObservableVocabularyListState;

  public constructor(
    searchInput: string,
    vocabularyListState: ObservableVocabularyListState,
    screenName: ScreenName,
    topBar: ObservableTouchableTopBar
  ) {
    super(screenName, topBar);
    this.searchInput = searchInput;
    this.vocabularyListState = vocabularyListState;
  }
}
