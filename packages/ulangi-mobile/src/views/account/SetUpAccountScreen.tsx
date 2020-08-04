/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ButtonSize, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSetUpAccountScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { SetUpAccountScreenIds } from '../../constants/ids/SetUpAccountScreenIds';
import { SetUpAccountScreenDelegate } from '../../delegates/account/SetUpAccountScreenDelegate';
import { RoundedCornerButtonStyle } from '../../styles/RoundedCornerButtonStyle';
import { DefaultButton } from '../common/DefaultButton';
import { DefaultTextInput } from '../common/DefaultTextInput';
import { SmartScrollView } from '../common/SmartScrollView';
import {
  SetUpAccountScreenStyles,
  darkStyles,
  lightStyles,
} from './SetUpAccountScreen.style';

export interface SetUpAccountScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableSetUpAccountScreen;
  screenDelegate: SetUpAccountScreenDelegate;
}

@observer
export class SetUpAccountScreen extends React.Component<
  SetUpAccountScreenProps
> {
  public get styles(): SetUpAccountScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.screen} testID={SetUpAccountScreenIds.SCREEN}>
        <SmartScrollView
          style={this.styles.form}
          keyboardAware={true}
          keyboardShouldPersistTaps="handled">
          <View style={this.styles.text_input_container}>
            <DefaultTextInput
              testID={SetUpAccountScreenIds.EMAIL_INPUT}
              style={this.styles.text_input}
              value={this.props.observableScreen.email}
              onChangeText={(text): void => {
                this.props.observableScreen.email = text;
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={
                this.props.themeStore.theme === Theme.LIGHT
                  ? config.styles.light.secondaryTextColor
                  : config.styles.dark.secondaryTextColor
              }
            />
          </View>
          <View style={this.styles.text_input_container}>
            <DefaultTextInput
              testID={SetUpAccountScreenIds.PASSWORD_INPUT}
              style={this.styles.text_input}
              value={this.props.observableScreen.password}
              autoCapitalize="none"
              placeholder="Password (min 8 characters)"
              placeholderTextColor={
                this.props.themeStore.theme === Theme.LIGHT
                  ? config.styles.light.secondaryTextColor
                  : config.styles.dark.secondaryTextColor
              }
              onChangeText={(text): void => {
                this.props.observableScreen.password = text;
              }}
              secureTextEntry={true}
            />
          </View>
          <View style={this.styles.text_input_container}>
            <DefaultTextInput
              testID={SetUpAccountScreenIds.CONFIRM_PASSWORD_INPUT}
              style={this.styles.text_input}
              value={this.props.observableScreen.confirmPassword}
              autoCapitalize="none"
              placeholder="Confirm password"
              placeholderTextColor={
                this.props.themeStore.theme === Theme.LIGHT
                  ? config.styles.light.secondaryTextColor
                  : config.styles.dark.secondaryTextColor
              }
              onChangeText={(text): void => {
                this.props.observableScreen.confirmPassword = text;
              }}
              secureTextEntry={true}
              returnKeyType="done"
              onSubmitEditing={this.props.screenDelegate.submit}
            />
          </View>
          <View style={this.styles.submit_btn_container}>
            <DefaultButton
              testID={SetUpAccountScreenIds.SUBMIT_BTN}
              text="Submit"
              styles={RoundedCornerButtonStyle.getFullBackgroundStyles(
                ButtonSize.LARGE,
                4,
                config.styles.primaryColor,
                'white',
              )}
              onPress={this.props.screenDelegate.submit}
            />
          </View>
        </SmartScrollView>
      </View>
    );
  }
}
