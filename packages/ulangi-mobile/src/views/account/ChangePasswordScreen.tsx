/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableChangePasswordScreen,
  ObservableDarkModeStore,
  ObservableUserStore,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { ChangePasswordScreenIds } from '../../constants/ids/ChangePasswordScreenIds';
import { DefaultText } from '../common/DefaultText';
import { ChangePasswordForm } from './ChangePasswordForm';

export interface ChangePasswordScreenProps {
  darkModeStore: ObservableDarkModeStore;
  userStore: ObservableUserStore;
  observableScreen: ObservableChangePasswordScreen;
}

export class ChangePasswordScreen extends React.Component<
  ChangePasswordScreenProps
> {
  private renderGuestNote(): null | React.ReactElement<any> {
    if (
      this.props.userStore.existingCurrentUser.email.endsWith(
        config.general.guestEmailDomain,
      )
    ) {
      return (
        <View style={styles.guest_note_container}>
          <DefaultText style={styles.guest_note}>
            If you are using a guest account and have not changed the password
            before, the current password is{' '}
            <DefaultText style={styles.bold}>
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
      <View testID={ChangePasswordScreenIds.SCREEN} style={styles.screen}>
        {this.renderGuestNote()}
        <ChangePasswordForm
          theme={this.props.darkModeStore.theme}
          observableScreen={this.props.observableScreen}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  guest_note_container: {
    padding: 16,
  },

  guest_note: {
    color: '#222',
    fontSize: 15,
  },

  bold: {
    fontWeight: '700',
  },
});
