/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSignInScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { SignInScreenIds } from '../../constants/ids/SignInScreenIds';
import { SignInScreenDelegate } from '../../delegates/auth/SignInScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { SmartScrollView } from '../common/SmartScrollView';
import { Logo } from './Logo';
import { SignInForm } from './SignInForm';
import { SubmitButton } from './SubmitButton';

export interface SignInScreenProps {
  observableScreen: ObservableSignInScreen;
  screenDelegate: SignInScreenDelegate;
}

@observer
export class SignInScreen extends React.Component<SignInScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <DismissKeyboardView
        style={styles.screen}
        testID={SignInScreenIds.SCREEN}
      >
        <View style={styles.container}>
          <View style={styles.logo_container}>
            <Logo />
          </View>
          <SmartScrollView
            style={styles.form_container}
            keyboardAware={true}
            keyboardShouldPersistTaps="handled"
          >
            <SignInForm
              email={this.props.observableScreen.email}
              password={this.props.observableScreen.password}
              shouldFocusPassword={
                this.props.observableScreen.shouldFocusPassword
              }
              submit={this.props.screenDelegate.signIn}
              navigateToSignUpScreen={
                this.props.screenDelegate.navigateToSignUpScreen
              }
              navigateToForgotPasswordScreen={
                this.props.screenDelegate.navigateToForgotPasswordScreen
              }
            />
          </SmartScrollView>
          <View style={styles.sign_in_as_guest_container}>
            <SubmitButton
              testID={SignInScreenIds.GUEST_SIGN_IN_BTN}
              buttonText="Sign in as Guest"
              style={styles.sign_in_as_guest_btn}
              textStyle={styles.sign_in_as_guest_btn_text}
              onSubmit={this.props.screenDelegate.signInAsGuest}
            />
            <DefaultText style={styles.sign_in_as_guest_note}>
              You can set up account later.
            </DefaultText>
          </View>
        </View>
      </DismissKeyboardView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  logo_container: {
    marginTop: 20,
  },

  form_container: {
    marginTop: 20,
    flex: 1,
  },

  sign_in_as_guest_container: {
    marginBottom: 30,
  },

  sign_in_as_guest_btn: {
    backgroundColor: '#64d392',
  },

  sign_in_as_guest_btn_text: {
    color: '#fff',
  },

  sign_in_as_guest_note: {
    paddingHorizontal: 16,
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 15,
    color: config.styles.lightPrimaryColor,
  },
});
