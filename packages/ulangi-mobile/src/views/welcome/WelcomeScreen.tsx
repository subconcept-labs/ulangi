/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { WelcomeScreenIds } from '../../constants/ids/WelcomeScreenIds';
import { WelcomeScreenDelegate } from '../../delegates/welcome/WelcomeScreenDelegate';
import { ss } from '../../utils/responsive';
import { Logo } from '../auth/Logo';
import { SubmitButton } from '../auth/SubmitButton';
import { DefaultText } from '../common/DefaultText';

export interface WelcomeScreenProps {
  screenDelegate: WelcomeScreenDelegate;
}

@observer
export class WelcomeScreen extends React.Component<WelcomeScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.logo_container}>
          <Logo />
        </View>
        <View style={styles.title_container}>
          <DefaultText style={styles.title}>Hi there!</DefaultText>
          <DefaultText style={styles.title}>Are you new to Ulangi?</DefaultText>
        </View>
        <SubmitButton
          testID={WelcomeScreenIds.YES_BTN}
          buttonText="Yes. I'm a new user."
          style={styles.yes_btn}
          textStyle={styles.yes_btn_text}
          onSubmit={this.props.screenDelegate.signInAsGuest}
        />
        <SubmitButton
          testID={WelcomeScreenIds.NO_BTN}
          buttonText="No. I have an account."
          style={styles.no_btn}
          textStyle={styles.no_text}
          onSubmit={this.props.screenDelegate.navigateToSignInScreen}
        />
      </SafeAreaView>
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
    marginTop: ss(20),
  },

  title_container: {
    marginTop: ss(30),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: ss(18),
    fontWeight: 'bold',
    color: 'white',
  },

  yes_btn: {
    backgroundColor: '#64d392',
  },

  yes_btn_text: {
    color: '#fff',
  },

  no_btn: {
    marginTop: ss(10),
    marginBottom: ss(20),
  },

  no_text: {},
});
