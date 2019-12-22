/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { PublicVocabularyConverter } from '@ulangi/ulangi-common/converters';
import { ContactUsFormType, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  PublicVocabulary,
  SelectionItem,
} from '@ulangi/ulangi-common/interfaces';
import {
  ObservableLightBox,
  ObservableSetStore,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { PublicVocabularyActionMenuIds } from '../../constants/ids/PublicVocabularyActionMenuIds';
import { NavigatorDelegate } from '../../delegates/navigator/NavigatorDelegate';

export class PublicVocabularyActionMenuDelegate {
  private publicVocabularyConverter = new PublicVocabularyConverter();

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

  public show(publicVocabulary: PublicVocabulary): void {
    const items: SelectionItem[] = [
      this.getEditBeforeAddingButton(publicVocabulary),
      this.getReportAnErrorButton(publicVocabulary),
    ];

    this.observableLightBox.actionMenu = {
      testID: PublicVocabularyActionMenuIds.ACTION_MENU,
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
    publicVocabulary: PublicVocabulary
  ): SelectionItem {
    return {
      testID: PublicVocabularyActionMenuIds.EDIT_BEFORE_ADDING_BTN,
      text: 'Edit before adding',
      onPress: (): void => {
        const vocabulary = this.publicVocabularyConverter.convertToVocabulary(
          publicVocabulary,
          _.first(publicVocabulary.categories)
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
    publicVocabulary: PublicVocabulary
  ): SelectionItem {
    return {
      testID: PublicVocabularyActionMenuIds.REPORT_ERRORS_BTN,
      text: 'Report an error',
      onPress: (): void => {
        const message = [
          `Term: ${publicVocabulary.vocabularyText}`,
          `Sources: ${publicVocabulary.definitions
            .map((definition): string => definition.source)
            .join(', ')}`,
          `Languages: ${this.setStore.existingCurrentSet.learningLanguageCode +
            '-' +
            this.setStore.existingCurrentSet.translatedToLanguageCode}`,
          'Comments (optional): ',
        ].join('\n');

        this.navigatorDelegate.push(ScreenName.CONTACT_US_SCREEN, {
          initialFormType: ContactUsFormType.REPORT_AN_ERROR,
          message,
        });

        this.navigatorDelegate.dismissLightBox();
      },
    };
  }
}
