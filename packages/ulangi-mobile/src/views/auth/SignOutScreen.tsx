/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Screen } from '../common/Screen';

export interface SignOutScreenProps {
  observableScreen: ObservableScreen;
}

@observer
export class SignOutScreen extends React.Component<SignOutScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={styles.screen}
        observableScreen={this.props.observableScreen}
        useSafeAreaView={true}>
        <ActivityIndicator color="white" />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
