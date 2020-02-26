/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DiscoverListType, ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTouchableTopBar } from '../top-bar/ObservableTouchableTopBar';
import { ObservableTranslationListState } from '../translation/ObservableTranslationListState';
import { ObservablePublicSetListState } from './ObservablePublicSetListState';
import { ObservablePublicVocabularyListState } from './ObservablePublicVocabularyListState';

export class ObservableDiscoverScreen extends ObservableScreen {
  public readonly searchInput: IObservableValue<string>;

  public readonly searchInputAutoFocus: IObservableValue<boolean>;

  public readonly shouldFocusSearchInput: IObservableValue<boolean>;

  public readonly listType: IObservableValue<null | DiscoverListType>;

  public readonly publicSetCount: IObservableValue<null | number>;

  public readonly publicSetListState: ObservablePublicSetListState;

  public readonly publicVocabularyListState: ObservablePublicVocabularyListState;

  public readonly translationListState: ObservableTranslationListState;

  public constructor(
    searchInput: IObservableValue<string>,
    searchInputAutoFocus: IObservableValue<boolean>,
    shouldFocusSearchInput: IObservableValue<boolean>,
    listType: IObservableValue<null | DiscoverListType>,
    publicSetCount: IObservableValue<null | number>,
    publicSetListState: ObservablePublicSetListState,
    publicVocabularyListState: ObservablePublicVocabularyListState,
    translationListState: ObservableTranslationListState,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTouchableTopBar
  ) {
    super(componentId, screenName, topBar);
    this.searchInput = searchInput;
    this.searchInputAutoFocus = searchInputAutoFocus;
    this.shouldFocusSearchInput = shouldFocusSearchInput;
    this.listType = listType;
    this.publicSetCount = publicSetCount;
    this.publicSetListState = publicSetListState;
    this.publicVocabularyListState = publicVocabularyListState;
    this.translationListState = translationListState;
  }
}
