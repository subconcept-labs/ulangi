/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { WelcomeScreenIds } from '../../constants/ids/WelcomeScreenIds';
import { WelcomeScreenDelegate } from '../../delegates/welcome/WelcomeScreenDelegate';
import { Logo } from '../auth/Logo';
import { SubmitButton } from '../auth/SubmitButton';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import {
  WelcomeScreenStyles,
  welcomeScreenResponsiveStyles,
} from './WelcomeScreen.style';

export interface WelcomeScreenProps {
  screenDelegate: WelcomeScreenDelegate;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableScreen;
}

@observer
export class WelcomeScreen extends React.Component<WelcomeScreenProps> {
  private get styles(): WelcomeScreenStyles {
    return welcomeScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <View style={this.styles.logo_container}>
          <Logo />
        </View>
        <View style={this.styles.title_container}>
          <DefaultText style={this.styles.title}>Hi there!</DefaultText>
          <DefaultText style={this.styles.title}>
            Are you new to Ulangi?
          </DefaultText>
        </View>
        <SubmitButton
          testID={WelcomeScreenIds.YES_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          buttonText="Yes. I'm a new user."
          style={this.styles.yes_btn}
          textStyle={this.styles.yes_btn_text}
          onSubmit={this.props.screenDelegate.signInAsGuest}
        />
        <SubmitButton
          testID={WelcomeScreenIds.NO_BTN}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          buttonText="No. I have an account."
          style={this.styles.no_btn}
          textStyle={this.styles.no_text}
          onSubmit={this.props.screenDelegate.navigateToSignInScreen}
        />
      </Screen>
    );
  }
}
