/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';

import { ObservableDictionaryEntryState } from '../dictionary/ObservableDictionaryEntryState';
import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTranslationListState } from '../translation/ObservableTranslationListState';

export class ObservableDictionaryPickerScreen extends ObservableScreen {
  public readonly currentTerm: string;
  public readonly dictionaryEntryState: ObservableDictionaryEntryState;
  public readonly translationListState: ObservableTranslationListState;

  public constructor(
    currentTerm: string,
    dictionaryEntryState: ObservableDictionaryEntryState,
    translationListState: ObservableTranslationListState,
    componentId: string,
    screenName: ScreenName
  ) {
    super(componentId, screenName, null);
    this.currentTerm = currentTerm;
    this.dictionaryEntryState = dictionaryEntryState;
    this.translationListState = translationListState;
  }
}
