/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableSignUpScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { SignUpScreenIds } from '../../constants/ids/SignUpScreenIds';
import { SignUpScreenDelegate } from '../../delegates/auth/SignUpScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { SmartScrollView } from '../common/SmartScrollView';
import { Logo } from './Logo';
import { SignUpForm } from './SignUpForm';

export interface SignUpScreenProps {
  observableScreen: ObservableSignUpScreen;
  screenDelegate: SignUpScreenDelegate;
}

@observer
export class SignUpScreen extends React.Component<SignUpScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <DismissKeyboardView
        style={styles.screen}
        testID={SignUpScreenIds.SCREEN}>
        <View style={styles.container}>
          <View style={styles.logo_container}>
            <Logo />
          </View>
          <SmartScrollView
            style={styles.form_container}
            keyboardAware={true}
            keyboardShouldPersistTaps="handled">
            <SignUpForm
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
});
