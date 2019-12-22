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
import { SignInScreenIds } from '../../constants/ids/SignInScreenIds';
import { DefaultText } from '../common/DefaultText';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

export interface SignInFormProps {
  email: IObservableValue<string>;
  password: IObservableValue<string>;
  shouldFocusPassword: IObservableValue<boolean>;
  submit: () => void;
  navigateToSignUpScreen: () => void;
  navigateToForgotPasswordScreen: () => void;
}

export class SignInForm extends React.Component<SignInFormProps> {
  @boundMethod
  private focusPassword(): void {
    this.props.shouldFocusPassword.set(true);
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.form}>
        <InputField
          testID={SignInScreenIds.EMAIL_INPUT}
          value={this.props.email}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          onSubmitEditing={this.focusPassword}
        />
        <InputField
          testID={SignInScreenIds.PASSWORD_INPUT}
          value={this.props.password}
          shouldFocus={this.props.shouldFocusPassword}
          placeholder="Password"
          secureTextEntry={true}
          returnKeyType="done"
          autoCapitalize="none"
          onSubmitEditing={this.props.submit}
        />
        <SubmitButton
          testID={SignInScreenIds.SIGN_IN_BTN}
          buttonText="Sign in"
          onSubmit={this.props.submit}
        />
        <View style={styles.other_containers}>
          <TouchableOpacity
            testID={SignInScreenIds.FORGOT_PASSWORD_BTN}
            style={styles.touchable_text}
            onPress={this.props.navigateToForgotPasswordScreen}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <DefaultText style={styles.other_text}>Forgot password</DefaultText>
          </TouchableOpacity>
          <TouchableOpacity
            testID={SignInScreenIds.SIGN_UP_BTN}
            style={styles.touchable_text}
            onPress={this.props.navigateToSignUpScreen}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <DefaultText style={styles.other_text}>
              {`Sign up. It's free`}
            </DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },

  other_containers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },

  touchable_text: {},

  other_text: {
    fontSize: 15,
    color: config.styles.lightPrimaryColor,
  },
});
