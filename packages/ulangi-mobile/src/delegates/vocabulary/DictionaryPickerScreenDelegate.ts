/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { ScreenName } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import {
  ObservableDictionaryDefinition,
  ObservableDictionaryPickerScreen,
  ObservableTranslation,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';

import { DictionaryEntryDelegate } from '../dictionary/DictionaryEntryDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { TranslationListDelegate } from '../translation/TranslationListDelegate';

@boundClass
export class DictionaryPickerScreenDelegate {
  private observableScreen: ObservableDictionaryPickerScreen;
  private dictionaryEntryDelegate: DictionaryEntryDelegate;
  private translationListDelegate: TranslationListDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private onPick: (definition: DeepPartial<Definition>) => void;

  public constructor(
    observableScreen: ObservableDictionaryPickerScreen,
    dictionaryEntryDelegate: DictionaryEntryDelegate,
    translationListDelegate: TranslationListDelegate,
    navigatorDelegate: NavigatorDelegate,
    onPick: (definition: DeepPartial<Definition>) => void,
  ) {
    this.observableScreen = observableScreen;
    this.dictionaryEntryDelegate = dictionaryEntryDelegate;
    this.translationListDelegate = translationListDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.onPick = onPick;
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

  public showLink(link: string, screenTitle: string): void {
    this.navigatorDelegate.showModal(ScreenName.BROWSER_SCREEN, {
      link,
      screenTitle,
    });
  }

  public close(): void {
    this.navigatorDelegate.dismissLightBox();
  }

  public onPickDictionaryDefinition(
    definition: ObservableDictionaryDefinition,
  ): void {
    definition.isAdded = true;
    this.onPick({
      meaning: definition.meaning,
      wordClasses: definition.wordClasses,
      source: definition.source,
    });
  }

  public onPickTranslation(translation: ObservableTranslation): void {
    translation.isAdded = true;
    this.onPick({
      meaning: translation.translatedText,
      wordClasses: [],
      source: translation.translatedBy,
    });
  }
}
