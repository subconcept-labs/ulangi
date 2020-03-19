/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableSuggestionListState } from '../vocabulary/ObservableSuggestionListState';

export class ObservableSuggestionsPickerScreen extends ObservableScreen {
  public readonly suggestionListState: ObservableSuggestionListState;

  public constructor(
    suggestionListState: ObservableSuggestionListState,
    componentId: string,
    screenName: ScreenName
  ) {
    super(componentId, screenName, null);
    this.suggestionListState = suggestionListState;
  }
}
