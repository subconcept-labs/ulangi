/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

@observer
export class SignOutScreen extends React.Component {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="white" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
