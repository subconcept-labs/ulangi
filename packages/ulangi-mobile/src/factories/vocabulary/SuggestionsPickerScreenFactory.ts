/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSuggestionsPickerScreen } from '@ulangi/ulangi-observable';

import { DictionaryEntryDelegate } from '../../delegates/dictionary/DictionaryEntryDelegate';
import { SuggestionListDelegate } from '../../delegates/vocabulary/SuggestionListDelegate';
import { SuggestionsPickerScreenDelegate } from '../../delegates/vocabulary/SuggestionsPickerScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SuggestionsPickerScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableSuggestionsPickerScreen,
    onSelect: (fieldName: string, value: string) => string,
  ): SuggestionsPickerScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const dictionaryEntryDelegate = new DictionaryEntryDelegate(
      this.eventBus,
      this.props.rootStore.setStore,
      this.props.observableConverter,
      observableScreen.suggestionListState.dictionaryEntryState,
    );

    const suggestionListDelegate = new SuggestionListDelegate(
      observableScreen.suggestionListState,
      dictionaryEntryDelegate,
      onSelect,
    );

    return new SuggestionsPickerScreenDelegate(
      suggestionListDelegate,
      navigatorDelegate,
    );
  }
}
