/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { IObservableValue } from 'mobx';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { ForgotPasswordScreenIds } from '../../constants/ids/ForgotPasswordScreenIds';
import { DefaultText } from '../common/DefaultText';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

export interface ForgotPasswordFormProps {
  email: IObservableValue<string>;
  submit: () => void;
  back: () => void;
}

export class ForgotPasswordForm extends React.Component<
  ForgotPasswordFormProps
> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.form}>
        <InputField
          testID={ForgotPasswordScreenIds.EMAIL_INPUT}
          value={this.props.email}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="done"
          onSubmitEditing={this.props.submit}
        />
        <SubmitButton
          testID={ForgotPasswordScreenIds.SUBMIT_BTN}
          buttonText="Submit"
          onSubmit={this.props.submit}
        />
        <View style={styles.other_containers}>
          <TouchableOpacity
            testID={ForgotPasswordScreenIds.BACK_BTN}
            style={styles.touchable_text}
            onPress={this.props.back}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <DefaultText style={styles.other_text}>Back to Sign In</DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {},

  text_container: {
    paddingHorizontal: 16,
  },

  text: {
    color: '#999',
  },

  other_containers: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },

  touchable_text: {},

  other_text: {
    fontSize: 15,
    color: config.styles.lightPrimaryColor,
  },
});
