/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSearchScreen } from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { autorun } from 'mobx';
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
  private textInputRef?: TextInput | null;
  private unsubscribeFocus?: () => void;

  public get styles(): SearchInputStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public componentDidMount(): void {
    this.unsubscribeFocus = autorun(this.handleFocus);
  }

  public componentWillUnmount(): void {
    if (typeof this.unsubscribeFocus !== 'undefined') {
      this.unsubscribeFocus();
    }
  }

  @boundMethod
  private handleFocus(): void {
    if (
      this.props.observableScreen.shouldFocusInput === true &&
      typeof this.textInputRef !== 'undefined' &&
      this.textInputRef !== null
    ) {
      this.textInputRef.focus();
      this.props.observableScreen.shouldFocusInput = false;
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.search_container}>
        <Image
          style={this.styles.search_icon}
          source={Images.SEARCH_GREY_14X14}
        />
        <TextInput
          testID={SearchScreenIds.SEARCH_INPUT}
          ref={(ref): void => {
            this.textInputRef = ref;
          }}
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
