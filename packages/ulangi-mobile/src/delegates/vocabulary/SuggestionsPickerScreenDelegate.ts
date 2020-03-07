/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSuggestionsPickerScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Linking } from 'react-native';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class SuggestionsPickerScreenDelegate {
  private observableScreen: ObservableSuggestionsPickerScreen;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableSuggestionsPickerScreen,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
  }

  public getSuggestions(): void {
  }

  public clearSuggestions(): void {
  }

  public openLink(link: string): void {
    Linking.openURL(link).catch(
      (err): void => console.error('An error occurred', err),
    );
  }

  public close(): void {
    this.navigatorDelegate.dismissLightBox();
  }
}
