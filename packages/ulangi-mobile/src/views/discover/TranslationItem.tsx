/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { TranslationWithLanguages } from '@ulangi/ulangi-common/interfaces';
import { ObservableTranslationWithLanguages } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { TranslationItemIds } from '../../constants/ids/TranslationItemIds';
import { DefaultText } from '../common/DefaultText';
import { FixedTouchableWithoutFeedback } from '../common/FixedTouchableWithoutFeedback';
import {
  TranslationItemStyles,
  darkStyles,
  lightStyles,
} from './TranslationItem.style';

export interface TranslationItemProps {
  theme: Theme;
  learningLanguageCode: string;
  translatedToLanguageCode: string;
  translation: ObservableTranslationWithLanguages;
  addVocabulary: (translation: TranslationWithLanguages) => void;
  showTranslationActionMenu: (translation: TranslationWithLanguages) => void;
  styles?: {
    light: TranslationItemStyles;
    dark: TranslationItemStyles;
  };
}

@observer
export class TranslationItem extends React.Component<TranslationItemProps> {
  public get styles(): TranslationItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    const vocabularyText =
      this.props.learningLanguageCode ===
      this.props.translation.sourceLanguageCode
        ? this.props.translation.sourceText
        : this.props.translation.translatedText;

    const meaning =
      this.props.translatedToLanguageCode ===
      this.props.translation.translatedLanguageCode
        ? this.props.translation.translatedText
        : this.props.translation.sourceText;

    return (
      <FixedTouchableWithoutFeedback
        testID={TranslationItemIds.TRANSLATION_CONTAINER_BY_VOCABULARY_TEXT(
          vocabularyText,
        )}>
        <View style={this.styles.container}>
          <View style={this.styles.vocabulary_text_container}>
            <View style={this.styles.left}>
              <DefaultText style={this.styles.vocabulary_text}>
                {vocabularyText}
              </DefaultText>
            </View>
            <View style={this.styles.right}>
              {this.renderAddButton()}
              {this.renderActionButton()}
            </View>
          </View>
          <View style={this.styles.definition_list_container}>
            <View style={this.styles.definition_container}>
              <View style={this.styles.meaning_container}>
                <DefaultText style={this.styles.meaning}>{meaning}</DefaultText>
              </View>
            </View>
          </View>
          <View style={this.styles.attribution_container}>
            <Image
              source={
                this.props.theme === Theme.LIGHT
                  ? Images.TRANSLATE_BY_GOOGLE_COLOR_SHORT
                  : Images.TRANSLATE_BY_GOOGLE_WHITE_SHORT
              }
            />
          </View>
        </View>
      </FixedTouchableWithoutFeedback>
    );
  }

  private renderAddButton(): React.ReactElement<any> {
    const vocabularyText =
      this.props.learningLanguageCode ===
      this.props.translation.sourceLanguageCode
        ? this.props.translation.sourceText
        : this.props.translation.translatedText;

    return (
      <TouchableOpacity
        testID={TranslationItemIds.ADD_VOCABULARY_FROM_TRANSLATION_BTN_BY_VOCABULARY_TEXT(
          vocabularyText,
        )}
        style={this.styles.button}
        onPress={(): void => {
          this.props.addVocabulary(this.props.translation);
        }}>
        <Image
          source={
            this.props.theme === Theme.LIGHT
              ? Images.ADD_BLACK_16X16
              : Images.ADD_MILK_16X16
          }
        />
      </TouchableOpacity>
    );
  }

  private renderActionButton(): React.ReactElement<any> {
    const vocabularyText =
      this.props.learningLanguageCode ===
      this.props.translation.sourceLanguageCode
        ? this.props.translation.sourceText
        : this.props.translation.translatedText;

    return (
      <TouchableOpacity
        testID={TranslationItemIds.ADD_VOCABULARY_FROM_TRANSLATION_BTN_BY_VOCABULARY_TEXT(
          vocabularyText,
        )}
        style={this.styles.button}
        onPress={(): void => {
          this.props.showTranslationActionMenu(this.props.translation);
        }}>
        <Image
          source={
            this.props.theme === Theme.LIGHT
              ? Images.HORIZONTAL_DOTS_BLACK_16X16
              : Images.HORIZONTAL_DOTS_MILK_16X16
          }
        />
      </TouchableOpacity>
    );
  }
}
