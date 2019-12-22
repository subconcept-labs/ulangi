/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableLanguage } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { SetFormIds } from '../../constants/ids/SetFormIds';
import { DefaultText } from '../common/DefaultText';
import {
  LanguagePickerItemStyles,
  darkStyles,
  lightStyles,
} from './LanguagePickerItem.style';

export interface LanguagePickerItemProps {
  theme: Theme;
  isSelected: boolean;
  language: ObservableLanguage;
  onSelect: (languageCode: string) => void;
  styles?: {
    light: LanguagePickerItemStyles;
    dark: LanguagePickerItemStyles;
  };
}

@observer
export class LanguagePickerItem extends React.Component<
  LanguagePickerItemProps
> {
  public get styles(): LanguagePickerItemStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.item_container}>
        <TouchableOpacity
          testID={SetFormIds.SELECT_LANGUAGE_BTN_BY_LANGUAGE_NAME(
            this.props.language.fullName
          )}
          onPress={(): void =>
            this.props.onSelect(this.props.language.languageCode)
          }
          style={this.styles.touchable}
        >
          {this.props.isSelected === true ? (
            <Image
              source={Images.CHECK_BLUE_22X22}
              style={this.styles.select_icon}
            />
          ) : (
            <Image
              source={Images.UNCHECK_GREY_22X22}
              style={this.styles.select_icon}
            />
          )}
          {_.has(
            Images.FLAG_ICONS_BY_LANGUAGE_CODE,
            this.props.language.languageCode
          ) ? (
            <Image
              style={this.styles.flag_icon}
              source={_.get(
                Images.FLAG_ICONS_BY_LANGUAGE_CODE,
                this.props.language.languageCode
              )}
            />
          ) : (
            <Image
              style={this.styles.flag_icon}
              source={Images.FLAG_ICONS_BY_LANGUAGE_CODE.any}
            />
          )}
          <View style={this.styles.text_container}>
            <DefaultText style={this.styles.item_text}>
              {this.props.language.fullName}
            </DefaultText>
            {this.props.language.languageCode === 'any' ? (
              <DefaultText style={this.styles.item_note}>
                Some features are not available if you select this.
              </DefaultText>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
