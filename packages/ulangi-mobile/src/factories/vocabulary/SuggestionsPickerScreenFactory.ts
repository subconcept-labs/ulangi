/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSuggestionsPickerScreen } from '@ulangi/ulangi-observable';

import { SuggestionsPickerScreenDelegate } from '../../delegates/vocabulary/SuggestionsPickerScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class SuggestionsPickerScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    observableScreen: ObservableSuggestionsPickerScreen,
  ): SuggestionsPickerScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new SuggestionsPickerScreenDelegate(
      observableScreen,
      navigatorDelegate,
    );
  }
}
