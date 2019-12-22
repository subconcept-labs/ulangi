/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSearchScreen } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, TextInput, View } from 'react-native';

import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { SearchScreenIds } from '../../constants/ids/SearchScreenIds';
import {
  SearchInputStyles,
  darkStyles,
  lightStyles,
} from './SearchInput.style';

export interface SearchInputProps {
  theme: Theme;
  observableScreen: ObservableSearchScreen;
  submit: () => void;
  styles?: {
    light: SearchInputStyles;
    dark: SearchInputStyles;
  };
}

@observer
export class SearchInput extends React.Component<SearchInputProps> {
  private textInputRef?: any;

  public componentDidMount(): void {
    if (this.textInputRef) {
      _.delay(this.textInputRef.focus, 800);
    }
  }

  public get styles(): SearchInputStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.search_container}>
        <Image
          style={this.styles.search_icon}
          source={Images.SEARCH_GREY_14X14}
        />
        <TextInput
          ref={(ref): void => {
            this.textInputRef = ref;
          }}
          testID={SearchScreenIds.SEARCH_INPUT}
          style={this.styles.text_input}
          autoCapitalize="none"
          placeholderTextColor={
            this.props.theme === Theme.LIGHT
              ? config.styles.light.secondaryTextColor
              : config.styles.dark.secondaryTextColor
          }
          placeholder="Type to search your vocabulary..."
          returnKeyType="search"
          onChangeText={(text): void => {
            this.props.observableScreen.searchInput = text;
          }}
          onSubmitEditing={this.props.submit}
        />
      </View>
    );
  }
}
