/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { boundMethod } from 'autobind-decorator';
import { IObservableValue } from 'mobx';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { config } from '../../constants/config';
import { SignUpScreenIds } from '../../constants/ids/SignUpScreenIds';
import { DefaultText } from '../common/DefaultText';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

export interface SignUpFormProps {
  email: IObservableValue<string>;
  password: IObservableValue<string>;
  confirmPassword: IObservableValue<string>;
  shouldFocusPassword: IObservableValue<boolean>;
  shouldFocusConfirmPassword: IObservableValue<boolean>;
  submit: () => void;
  back: () => void;
}

export class SignUpForm extends React.Component<SignUpFormProps> {
  @boundMethod
  private focusPassword(): void {
    this.props.shouldFocusPassword.set(true);
  }

  @boundMethod
  private focusConfirmPassword(): void {
    this.props.shouldFocusConfirmPassword.set(true);
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.form}>
        <InputField
          testID={SignUpScreenIds.EMAIL_INPUT}
          value={this.props.email}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          onSubmitEditing={this.focusPassword}
        />
        <InputField
          testID={SignUpScreenIds.PASSWORD_INPUT}
          value={this.props.password}
          shouldFocus={this.props.shouldFocusPassword}
          placeholder="Password (min 8 characters)"
          returnKeyType="next"
          secureTextEntry={true}
          autoCapitalize="none"
          onSubmitEditing={this.focusConfirmPassword}
        />
        <InputField
          testID={SignUpScreenIds.CONFIRM_PASSWORD_INPUT}
          value={this.props.confirmPassword}
          shouldFocus={this.props.shouldFocusConfirmPassword}
          secureTextEntry={true}
          returnKeyType="done"
          placeholder="Confirm password"
          autoCapitalize="none"
          onSubmitEditing={this.props.submit}
        />
        <SubmitButton
          testID={SignUpScreenIds.SIGN_UP_BTN}
          buttonText="Sign up"
          onSubmit={this.props.submit}
        />
        <View style={styles.other_containers}>
          <TouchableOpacity
            testID={SignUpScreenIds.BACK_BTN}
            style={styles.touchable_text}
            onPress={this.props.back}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <DefaultText style={styles.other_text}>Back to Sign In</DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {},

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
