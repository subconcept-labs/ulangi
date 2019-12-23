/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableDictionaryPickerScreen } from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Linking } from 'react-native';

import { DictionaryEntryDelegate } from '../dictionary/DictionaryEntryDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { TranslationListDelegate } from '../translation/TranslationListDelegate';

@boundClass
export class DictionaryPickerScreenDelegate {
  private observableScreen: ObservableDictionaryPickerScreen;
  private dictionaryEntryDelegate: DictionaryEntryDelegate;
  private translationListDelegate: TranslationListDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    observableScreen: ObservableDictionaryPickerScreen,
    dictionaryEntryDelegate: DictionaryEntryDelegate,
    translationListDelegate: TranslationListDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.observableScreen = observableScreen;
    this.dictionaryEntryDelegate = dictionaryEntryDelegate;
    this.translationListDelegate = translationListDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public getDictionaryEntry(): void {
    this.dictionaryEntryDelegate.getDictionaryEntry(
      this.observableScreen.currentTerm,
    );
  }

  public clearDictionaryEntry(): void {
    this.dictionaryEntryDelegate.clearDictionaryEntry();
  }

  public translate(): void {
    this.translationListDelegate.translate(
      this.observableScreen.currentTerm,
      'google',
    );
  }

  public clearTranslations(): void {
    this.translationListDelegate.clearTranslations();
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
