/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableLanguage,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';
import {
  SimpleLanguagePickerStyles,
  simpleLanguagePickerResponsiveStyles,
} from './SimpleLanguagePicker.style';

export interface SimpleLanguagePickerProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  languages: readonly ObservableLanguage[];
  onSelect: (languageCode: string) => void;
  disabled: boolean;
}

@observer
export class SimpleLanguagePicker extends React.Component<
  SimpleLanguagePickerProps
> {
  private get styles(): SimpleLanguagePickerStyles {
    return simpleLanguagePickerResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ScrollView contentContainerStyle={this.styles.content_container}>
        {this.props.languages.map(
          (language): React.ReactElement<any> => {
            return this.renderItem(language);
          },
        )}
      </ScrollView>
    );
  }

  private renderItem(language: ObservableLanguage): React.ReactElement<any> {
    return (
      <TouchableOpacity
        key={language.languageCode}
        style={this.styles.item_touchable}
        onPress={(): void => this.props.onSelect(language.languageCode)}
        disabled={this.props.disabled}>
        {_.has(Images.FLAG_ICONS_BY_LANGUAGE_CODE, language.languageCode) ? (
          <Image
            style={this.styles.flag_icon}
            source={_.get(
              Images.FLAG_ICONS_BY_LANGUAGE_CODE,
              language.languageCode,
            )}
          />
        ) : (
          <Image
            style={this.styles.flag_icon}
            source={Images.FLAG_ICONS_BY_LANGUAGE_CODE.any}
          />
        )}
        <DefaultText style={this.styles.item_text}>
          {language.fullName}
        </DefaultText>
      </TouchableOpacity>
    );
  }
}
