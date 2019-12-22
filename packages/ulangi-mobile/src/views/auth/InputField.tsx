/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import autobind from 'autobind-decorator';
import { IObservableValue, autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export interface InputFieldProps {
  testID: string;
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
  private inputRef?: any;

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
      'shouldFocus should not be null or undefined'
    );
    if (shouldFocus.get() === true) {
      shouldFocus.set(false);
      this.inputRef.focus();
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.input_container}>
        <TextInput
          ref={(ref): void => {
            this.inputRef = ref;
          }}
          testID={this.props.testID}
          style={styles.input_field}
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

const styles = StyleSheet.create({
  input_container: {},

  input_field: {
    height: 46,
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    //backgroundColor: '#0083b3',
    backgroundColor: '#eee',
    color: '#545454',
    fontSize: 15,
    fontWeight: '700',
  },
});
