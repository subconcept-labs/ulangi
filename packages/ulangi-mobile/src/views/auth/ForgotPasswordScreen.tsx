/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableForgotPasswordScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { ForgotPasswordScreenIds } from '../../constants/ids/ForgotPasswordScreenIds';
import { ForgotPasswordScreenDelegate } from '../../delegates/auth/ForgotPasswordScreenDelegate';
import { DismissKeyboardView } from '../common/DismissKeyboardView';
import { Screen } from '../common/Screen';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import {
  ForgotPasswordScreenStyles,
  forgotPasswordScreenResponsiveStyles,
} from './ForgotPasswordScreen.style';
import { Logo } from './Logo';

export interface ForgotPasswordScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableForgotPasswordScreen;
  screenDelegate: ForgotPasswordScreenDelegate;
}

@observer
export class ForgotPasswordScreen extends React.Component<
  ForgotPasswordScreenProps
> {
  private get styles(): ForgotPasswordScreenStyles {
    return forgotPasswordScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={ForgotPasswordScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <DismissKeyboardView>
          <View style={this.styles.container}>
            <View style={this.styles.logo_container}>
              <Logo />
            </View>
            <View style={this.styles.form_container}>
              <ForgotPasswordForm
                theme={this.props.themeStore.theme}
                screenLayout={this.props.observableScreen.screenLayout}
                email={this.props.observableScreen.email}
                submit={this.props.screenDelegate.requestResetPasswordEmail}
                back={this.props.screenDelegate.back}
              />
            </View>
          </View>
        </DismissKeyboardView>
      </Screen>
    );
  }
}
