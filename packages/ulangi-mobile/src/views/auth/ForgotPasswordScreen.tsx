/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { ForgotPasswordScreenIds } from '../../constants/ids/ForgotPasswordScreenIds';
import { ForgotPasswordScreenDelegate } from '../../delegates/auth/ForgotPasswordScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Logo } from './Logo';

export interface ForgotPasswordScreenProps {
  observableScreen: ObservableForgotPasswordScreen;
  screenDelegate: ForgotPasswordScreenDelegate;
}

@observer
export class ForgotPasswordScreen extends React.Component<
  ForgotPasswordScreenProps
> {
  public render(): React.ReactElement<any> {
    return (
      <DismissKeyboardView
        style={styles.screen}
        testID={ForgotPasswordScreenIds.SCREEN}>
        <View style={styles.container}>
          <View style={styles.logo_container}>
            <Logo />
          </View>
          <View style={styles.form_container}>
            <ForgotPasswordForm
              email={this.props.observableScreen.email}
              submit={this.props.screenDelegate.requestResetPasswordEmail}
              back={this.props.screenDelegate.back}
            />
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
});
