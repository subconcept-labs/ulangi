/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableSignUpScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { SignUpScreenIds } from '../../constants/ids/SignUpScreenIds';
import { SignUpScreenDelegate } from '../../delegates/auth/SignUpScreenDelegate';
import { Screen } from '../common/Screen';
import { SmartScrollView } from '../common/SmartScrollView';
import { Logo } from './Logo';
import { SignUpForm } from './SignUpForm';
import {
  SignUpScreenStyles,
  signUpScreenResponsiveStyles,
} from './SignUpScreen.style';

export interface SignUpScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSignUpScreen;
  screenDelegate: SignUpScreenDelegate;
}

@observer
export class SignUpScreen extends React.Component<SignUpScreenProps> {
  private get styles(): SignUpScreenStyles {
    return signUpScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={SignUpScreenIds.SCREEN}
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
            <SignUpForm
              theme={this.props.themeStore.theme}
              screenLayout={this.props.observableScreen.screenLayout}
              email={this.props.observableScreen.email}
              password={this.props.observableScreen.password}
              confirmPassword={this.props.observableScreen.confirmPassword}
              shouldFocusPassword={
                this.props.observableScreen.shouldFocusPassword
              }
              shouldFocusConfirmPassword={
                this.props.observableScreen.shouldFocusConfirmPassword
              }
              submit={this.props.screenDelegate.signUp}
              back={this.props.screenDelegate.back}
            />
          </SmartScrollView>
        </View>
      </Screen>
    );
  }
}
