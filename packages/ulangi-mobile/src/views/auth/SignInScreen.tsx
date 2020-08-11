/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableSignInScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { SignInScreenIds } from '../../constants/ids/SignInScreenIds';
import { SignInScreenDelegate } from '../../delegates/auth/SignInScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { SmartScrollView } from '../common/SmartScrollView';
import { Logo } from './Logo';
import { SignInForm } from './SignInForm';
import {
  SignInScreenStyles,
  signInScreenResponsiveStyles,
} from './SignInScreen.style';
import { SubmitButton } from './SubmitButton';

export interface SignInScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSignInScreen;
  screenDelegate: SignInScreenDelegate;
}

@observer
export class SignInScreen extends React.Component<SignInScreenProps> {
  private get styles(): SignInScreenStyles {
    return signInScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SignInScreenIds.SCREEN}
        useSafeAreaView={true}
        useDismissKeyboardView={true}
        observableScreen={this.props.observableScreen}>
        <View style={this.styles.container}>
          <View style={this.styles.logo_container}>
            <Logo />
          </View>
          <SmartScrollView
            style={this.styles.form_container}
            keyboardAware={true}
            keyboardShouldPersistTaps="handled">
            <SignInForm
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
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
          <View style={this.styles.sign_in_as_guest_container}>
            <SubmitButton
              testID={SignInScreenIds.GUEST_SIGN_IN_BTN}
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              buttonText="Sign in as Guest"
              style={this.styles.sign_in_as_guest_btn}
              textStyle={this.styles.sign_in_as_guest_btn_text}
              onSubmit={this.props.screenDelegate.signInAsGuest}
            />
            <DefaultText style={this.styles.sign_in_as_guest_note}>
              You can set up account later.
            </DefaultText>
          </View>
        </View>
      </Screen>
    );
  }
}
