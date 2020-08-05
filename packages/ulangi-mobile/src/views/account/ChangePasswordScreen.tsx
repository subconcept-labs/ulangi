/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableChangePasswordScreen,
  ObservableThemeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { ChangePasswordScreenIds } from '../../constants/ids/ChangePasswordScreenIds';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { ChangePasswordForm } from './ChangePasswordForm';
import {
  ChangePasswordScreenStyles,
  changePasswordScreenResponsiveStyles,
} from './ChangePasswordScreen.style';

export interface ChangePasswordScreenProps {
  themeStore: ObservableThemeStore;
  userStore: ObservableUserStore;
  observableScreen: ObservableChangePasswordScreen;
}

@observer
export class ChangePasswordScreen extends React.Component<
  ChangePasswordScreenProps
> {
  private get styles(): ChangePasswordScreenStyles {
    return changePasswordScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  private renderGuestNote(): null | React.ReactElement<any> {
    if (
      this.props.userStore.existingCurrentUser.email.endsWith(
        config.general.guestEmailDomain,
      )
    ) {
      return (
        <View style={this.styles.guest_note_container}>
          <DefaultText style={this.styles.guest_note}>
            If you are using a guest account and have not changed the password
            before, the current password is{' '}
            <DefaultText style={this.styles.bold}>
              {config.general.guestPassword}
            </DefaultText>
          </DefaultText>
        </View>
      );
    } else {
      return null;
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        testID={ChangePasswordScreenIds.SCREEN}
        style={this.styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        {this.renderGuestNote()}
        <ChangePasswordForm
          theme={this.props.themeStore.theme}
          observableScreen={this.props.observableScreen}
        />
      </Screen>
    );
  }
}
