/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { boundMethod } from 'autobind-decorator';
import { IObservableValue } from 'mobx';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { SignUpScreenIds } from '../../constants/ids/SignUpScreenIds';
import { DefaultText } from '../common/DefaultText';
import { InputField } from './InputField';
import {
  SignUpFormStyles,
  signUpFormResponsiveStyles,
} from './SignUpForm.style';
import { SubmitButton } from './SubmitButton';

export interface SignUpFormProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
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

  private get styles(): SignUpFormStyles {
    return signUpFormResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        <InputField
          testID={SignUpScreenIds.EMAIL_INPUT}
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          value={this.props.email}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          onSubmitEditing={this.focusPassword}
        />
        <InputField
          testID={SignUpScreenIds.PASSWORD_INPUT}
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
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
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
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
          theme={this.props.theme}
          screenLayout={this.props.screenLayout}
          buttonText="Sign up"
          onSubmit={this.props.submit}
        />
        <View style={this.styles.other_containers}>
          <TouchableOpacity
            testID={SignUpScreenIds.BACK_BTN}
            style={this.styles.touchable_text}
            onPress={this.props.back}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <DefaultText style={this.styles.other_text}>
              Back to Sign In
            </DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
