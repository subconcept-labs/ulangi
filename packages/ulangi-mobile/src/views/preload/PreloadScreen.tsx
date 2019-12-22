/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservablePreloadScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { PreloadScreenIds } from '../../constants/ids/PreloadScreenIds';
import { DefaultText } from '../common/DefaultText';

export interface PreloadScreenProps {
  observableScreen: ObservablePreloadScreen;
}

@observer
export class PreloadScreen extends React.Component<PreloadScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={PreloadScreenIds.SCREEN}>
        <ActivityIndicator color="white" />
        <DefaultText style={styles.message}>
          {this.props.observableScreen.message}
        </DefaultText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 13,
    color: '#fff',
  },
});
