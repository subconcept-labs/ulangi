/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { Theme } from '@ulangi/ulangi-common/enums';
import { Definition } from '@ulangi/ulangi-common/interfaces';
import { ObservableTranslation } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, View } from 'react-native';

import { Images } from '../../constants/Images';
import { VocabularyFormIds } from '../../constants/ids/VocabularyFormIds';
import { DefaultText } from '../common/DefaultText';
import { AddDefinitionButton } from './AddDefinitionButton';
import {
  TranslationStyles,
  darkStyles,
  lightStyles,
} from './Translation.style';

export interface TranslationProps {
  index: number;
  theme: Theme;
  translation: ObservableTranslation;
  onPick: (definition: DeepPartial<Definition>) => void;
  styles?: {
    light: TranslationStyles;
    dark: TranslationStyles;
  };
}

@observer
export class Translation extends React.Component<TranslationProps> {
  public get styles(): TranslationStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.definition_container}>
        <View style={this.styles.definition_content_container}>
          <View style={this.styles.meaning_container}>
            <DefaultText style={this.styles.meaning_text}>
              {this.props.translation.translatedText}
            </DefaultText>
            {this.props.translation.translatedBy === 'google' ? (
              <Image
                source={
                  this.props.theme === Theme.LIGHT
                    ? Images.TRANSLATE_BY_GOOGLE_COLOR_SHORT
                    : Images.TRANSLATE_BY_GOOGLE_GREY_SHORT
                }
              />
            ) : null}
          </View>
        </View>
        <View style={this.styles.add_button_container}>
          <AddDefinitionButton
            testID={VocabularyFormIds.ADD_DEFINITION_FROM_TRANSLATION_BY_INDEX(
              this.props.index,
            )}
            theme={this.props.theme}
            onPress={(): void =>
              this.props.onPick({
                meaning: this.props.translation.translatedText,
                wordClasses: [],
                source: this.props.translation.translatedBy,
              })
            }
          />
        </View>
      </View>
    );
  }
}
