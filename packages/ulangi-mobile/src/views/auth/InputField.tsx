/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import autobind from 'autobind-decorator';
import { IObservableValue, autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { DefaultTextInput } from '../common/DefaultTextInput';
import {
  InputFieldStyles,
  inputFieldResponsiveStyles,
} from './InputField.style';

export interface InputFieldProps {
  testID: string;
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  value: IObservableValue<string>;
  placeholder: string;
  secureTextEntry?: boolean;
  shouldFocus?: IObservableValue<boolean>;
  keyboardType?: 'default' | 'email-address';
  returnKeyType?: 'done' | 'next' | 'send' | 'go';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onSubmitEditing?: () => void;
}

@observer
export class InputField extends React.Component<InputFieldProps> {
  private unsubscribeAutoFocus?: () => void;
  private inputRef?: TextInput | null;

  public componentDidMount(): void {
    if (typeof this.props.shouldFocus !== 'undefined') {
      this.unsubscribeAutoFocus = autorun(this.autoFocus);
    }
  }

  public componentWillUnmount(): void {
    if (typeof this.unsubscribeAutoFocus !== 'undefined') {
      this.unsubscribeAutoFocus();
    }
  }

  @autobind
  private autoFocus(): void {
    const shouldFocus = assertExists(
      this.props.shouldFocus,
      'shouldFocus should not be null or undefined',
    );
    if (
      shouldFocus.get() === true &&
      typeof this.inputRef !== 'undefined' &&
      this.inputRef !== null
    ) {
      shouldFocus.set(false);
      this.inputRef.focus();
    }
  }

  private get styles(): InputFieldStyles {
    return inputFieldResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.input_container}>
        <DefaultTextInput
          ref={(ref): void => {
            this.inputRef = ref;
          }}
          testID={this.props.testID}
          style={this.styles.input_field}
          value={this.props.value.get()}
          placeholder={this.props.placeholder}
          placeholderTextColor="#999"
          onChangeText={(text): void => this.props.value.set(text)}
          secureTextEntry={this.props.secureTextEntry}
          autoCapitalize={this.props.autoCapitalize}
          keyboardType={this.props.keyboardType}
          returnKeyType={this.props.returnKeyType}
          onSubmitEditing={this.props.onSubmitEditing}
        />
      </View>
    );
  }
}
