/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { TranslationConverter } from '@ulangi/ulangi-common/converters';
import { ContactUsFormType, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  SelectionItem,
  TranslationWithLanguages,
} from '@ulangi/ulangi-common/interfaces';
import {
  ObservableLightBox,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';

import { TranslationActionMenuIds } from '../../constants/ids/TranslationActionMenuIds';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';

export class TranslationActionMenuDelegate {
  private translationConverter = new TranslationConverter();

  private observableLightBox: ObservableLightBox;
  private setStore: ObservableSetStore;
  private navigatorDelegate: NavigatorDelegate;
  private styles: {
    light: Options;
    dark: Options;
  };

  public constructor(
    observableLightBox: ObservableLightBox,
    setStore: ObservableSetStore,
    navigatorDelegate: NavigatorDelegate,
    styles: {
      light: Options;
      dark: Options;
    }
  ) {
    this.observableLightBox = observableLightBox;
    this.setStore = setStore;
    this.navigatorDelegate = navigatorDelegate;
    this.styles = styles;
  }

  public show(translation: TranslationWithLanguages): void {
    const items: SelectionItem[] = [
      this.getEditBeforeAddingButton(translation),
      this.getReportAnErrorButton(translation),
    ];

    this.observableLightBox.actionMenu = {
      testID: TranslationActionMenuIds.ACTION_MENU,
      title: 'Action',
      items,
    };

    this.navigatorDelegate.showLightBox(
      ScreenName.LIGHT_BOX_ACTION_MENU_SCREEN,
      {},
      this.styles
    );
  }

  private getEditBeforeAddingButton(
    translationWithLanguages: TranslationWithLanguages
  ): SelectionItem {
    return {
      testID: TranslationActionMenuIds.EDIT_BEFORE_ADDING_BTN,
      text: 'Edit before adding',
      onPress: (): void => {
        const translation = this.translationConverter.convertToTranslation(
          translationWithLanguages,
          this.setStore.existingCurrentSet.learningLanguageCode,
          this.setStore.existingCurrentSet.translatedToLanguageCode
        );

        const vocabulary = this.translationConverter.convertToVocabulary(
          translation
        );

        this.navigatorDelegate.push(ScreenName.ADD_VOCABULARY_SCREEN, {
          vocabulary,
          closeOnSaveSucceeded: true,
        });
        this.navigatorDelegate.dismissLightBox();
      },
    };
  }

  private getReportAnErrorButton(
    translationWithLanguages: TranslationWithLanguages
  ): SelectionItem {
    const translation = this.translationConverter.convertToTranslation(
      translationWithLanguages,
      this.setStore.existingCurrentSet.learningLanguageCode,
      this.setStore.existingCurrentSet.translatedToLanguageCode
    );

    const message = [
      `Term: ${translation.sourceText}`,
      `Meaning: ${translation.translatedText}`,
      `Translated by: ${translation.translatedBy}`,
      `Languages: ${this.setStore.existingCurrentSet.learningLanguageCode +
        '-' +
        this.setStore.existingCurrentSet.translatedToLanguageCode}`,
      'Comments (optional): ',
    ].join('\n');

    return {
      testID: TranslationActionMenuIds.REPORT_ERRORS_BTN,
      text: 'Report an error',
      onPress: (): void => {
        this.navigatorDelegate.push(ScreenName.CONTACT_US_SCREEN, {
          initialFormType: ContactUsFormType.REPORT_AN_ERROR,
          message,
        });

        this.navigatorDelegate.dismissLightBox();
      },
    };
  }
}
