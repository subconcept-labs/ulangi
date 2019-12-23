/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { PublicSetDetailScreenIds } from '../../constants/ids/PublicSetDetailScreenIds';
import { DefaultText } from '../common/DefaultText';
import {
  PublicVocabularyListHeaderStyles,
  darkStyles,
  lightStyles,
} from './PublicVocabularyListHeader.style';

export interface PublicVocabularyListHeaderProps {
  theme: Theme;
  numberOfTerms: number;
  addAllVocabulary: () => void;
  styles?: {
    light: PublicVocabularyListHeaderStyles;
    dark: PublicVocabularyListHeaderStyles;
  };
}

@observer
export class PublicVocabularyListHeader extends React.Component<
  PublicVocabularyListHeaderProps
> {
  public get styles(): PublicVocabularyListHeaderStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.header_container}>
        <View style={this.styles.term_count_container}>
          <DefaultText style={this.styles.term_count}>{`${
            this.props.numberOfTerms
          } terms`}</DefaultText>
        </View>
        {this.renderAddAllButton()}
      </View>
    );
  }
  private renderAddAllButton(): React.ReactElement<any> {
    return (
      <TouchableOpacity
        testID={PublicSetDetailScreenIds.ADD_ALL_BTN}
        style={this.styles.add_all_btn}
        onPress={this.props.addAllVocabulary}>
        <Image
          style={this.styles.add_all_plus}
          source={
            this.props.theme === Theme.LIGHT
              ? Images.ADD_BLACK_16X16
              : Images.ADD_MILK_16X16
          }
        />
        <DefaultText style={this.styles.add_all_text}>ALL</DefaultText>
      </TouchableOpacity>
    );
  }
}
