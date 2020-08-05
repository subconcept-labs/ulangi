/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableChangePasswordScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { ChangePasswordScreenIds } from '../../constants/ids/ChangePasswordScreenIds';
import { DefaultTextInput } from '../common/DefaultTextInput';
import {
  ChangePasswordFormStyles,
  changePasswordFormResponsiveStyles,
} from './ChangePasswordForm.style';

export interface ChangePasswordFormProps {
  theme: Theme;
  observableScreen: ObservableChangePasswordScreen;
  styles?: {
    light: ChangePasswordFormStyles;
    dark: ChangePasswordFormStyles;
  };
}

@observer
export class ChangePasswordForm extends React.Component<
  ChangePasswordFormProps
> {
  public get styles(): ChangePasswordFormStyles {
    return changePasswordFormResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.form}>
        <View style={this.styles.text_input_container}>
          <DefaultTextInput
            testID={ChangePasswordScreenIds.CURRENT_PASSWORD_INPUT}
            style={this.styles.text_input}
            value={this.props.observableScreen.currentPassword}
            onChangeText={(text): void => {
              this.props.observableScreen.currentPassword = text;
            }}
            placeholder="Current password"
            placeholderTextColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <View style={this.styles.text_input_container}>
          <DefaultTextInput
            testID={ChangePasswordScreenIds.NEW_PASSWORD_INPUT}
            style={this.styles.text_input}
            value={this.props.observableScreen.newPassword}
            onChangeText={(text): void => {
              this.props.observableScreen.newPassword = text;
            }}
            placeholder="New password"
            placeholderTextColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <View style={this.styles.text_input_container}>
          <DefaultTextInput
            testID={ChangePasswordScreenIds.CONFIRM_NEW_PASSWORD_INPUT}
            style={[this.styles.text_input, this.styles.no_border]}
            value={this.props.observableScreen.confirmNewPassword}
            onChangeText={(text): void => {
              this.props.observableScreen.confirmNewPassword = text;
            }}
            placeholder="Confirm new password"
            placeholderTextColor={
              this.props.theme === Theme.LIGHT
                ? config.styles.light.secondaryTextColor
                : config.styles.dark.secondaryTextColor
            }
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
      </View>
    );
  }
}
