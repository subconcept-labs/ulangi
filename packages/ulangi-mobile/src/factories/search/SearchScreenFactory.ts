/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSearchScreen } from '@ulangi/ulangi-observable';

import { SearchScreenDelegate } from '../../delegates/search/SearchScreenDelegate';
import { SearchVocabularyDelegate } from '../../delegates/search/SearchVocabularyDelegate';
import { SetSelectionMenuDelegate } from '../../delegates/set/SetSelectionMenuDelegate';
import { VocabularyActionMenuDelegate } from '../../delegates/vocabulary/VocabularyActionMenuDelegate';
import { VocabularyBulkActionMenuDelegate } from '../../delegates/vocabulary/VocabularyBulkActionMenuDelegate';
import { VocabularyEventDelegate } from '../../delegates/vocabulary/VocabularyEventDelegate';
import { VocabularySelectionDelegate } from '../../delegates/vocabulary/VocabularySelectionDelegate';
import { PrimaryScreenStyle } from '../../styles/PrimaryScreenStyle';
import { ScreenFactory } from '../ScreenFactory';

export class SearchScreenFactory extends ScreenFactory {
  public createSetSelectionMenuDelegate(): SetSelectionMenuDelegate {
    return new SetSelectionMenuDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.createNavigatorDelegate(),
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );
  }

  public createScreenDelegate(
    observableScreen: ObservableSearchScreen
  ): SearchScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dialogDelegate = this.createDialogDelegate(
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const setSelectionMenuDelegate = this.createSetSelectionMenuDelegate();

    const searchVocabularyDelegate = new SearchVocabularyDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.vocabularyListState,
      this.props.analytics
    );

    const vocabularyEventDelegate = new VocabularyEventDelegate(this.eventBus);

    const vocabularySelectionDelegate = new VocabularySelectionDelegate(
      observableScreen.vocabularyListState
    );

    const vocabularyActionMenuDelegate = new VocabularyActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      setSelectionMenuDelegate,
      vocabularySelectionDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    const vocabularyBulkActionMenuDelegate = new VocabularyBulkActionMenuDelegate(
      this.eventBus,
      this.observer,
      this.props.observableLightBox,
      observableScreen.vocabularyListState,
      setSelectionMenuDelegate,
      dialogDelegate,
      navigatorDelegate,
      PrimaryScreenStyle.LIGHT_BOX_SCREEN_STYLES
    );

    return new SearchScreenDelegate(
      this.eventBus,
      observableScreen,
      searchVocabularyDelegate,
      vocabularyEventDelegate,
      vocabularyActionMenuDelegate,
      vocabularyBulkActionMenuDelegate,
      vocabularySelectionDelegate,
      navigatorDelegate
    );
  }
}
