/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { boundMethod } from 'autobind-decorator';
import { IObservableValue, autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultTextInput } from '../common/DefaultTextInput';
import {
  SearchInputStyles,
  darkStyles,
  lightStyles,
} from './SearchInput.style';

export interface SearchInputProps {
  theme: Theme;
  input: IObservableValue<string>;
  shouldFocusInput: IObservableValue<boolean>;
  onSubmitEditing: () => void;
  styles?: {
    light: SearchInputStyles;
    dark: SearchInputStyles;
  };
}

@observer
export class SearchInput extends React.Component<SearchInputProps> {
  private textInputRef: TextInput | null | undefined;
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
      this.props.shouldFocusInput.get() === true &&
      typeof this.textInputRef !== 'undefined' &&
      this.textInputRef !== null
    ) {
      this.textInputRef.focus();
      this.props.shouldFocusInput.set(false);
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.input_container}>
        <DefaultTextInput
          placeholder="Type topics to search..."
          ref={(ref): void => {
            this.textInputRef = ref;
          }}
          style={this.styles.input}
          value={this.props.input.get()}
          onChangeText={(text): void => this.props.input.set(text)}
          onEndEditing={this.props.onSubmitEditing}
          autoCapitalize="none"
          placeholderTextColor={
            this.props.theme === Theme.LIGHT
              ? config.styles.light.secondaryTextColor
              : config.styles.dark.secondaryTextColor
          }
        />
      </View>
    );
  }
}
