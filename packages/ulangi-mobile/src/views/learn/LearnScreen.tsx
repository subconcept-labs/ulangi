/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableSetStore,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { LearnScreenIds } from '../../constants/ids/LearnScreenIds';
import { LearnScreenDelegate } from '../../delegates/learn/LearnScreenDelegate';
import { TipBar } from '../common/TipBar';
import { LearnList } from '../learn/LearnList';

export interface LearnScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  screenDelegate: LearnScreenDelegate;
}

@observer
export class LearnScreen extends React.Component<LearnScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={LearnScreenIds.SCREEN}>
        <TipBar
          theme={this.props.themeStore.theme}
          navigateToWhatToUseScreen={
            this.props.screenDelegate.navigateToWhatToUseScreen
          }
        />
        <LearnList
          theme={this.props.themeStore.theme}
          navigateToSpacedRepetitionScreen={
            this.props.screenDelegate.navigateToSpacedRepetitionScreen
          }
          navigateToWritingScreen={
            this.props.screenDelegate.navigateToWritingScreen
          }
          navigateToQuizScreen={this.props.screenDelegate.navigateToQuizScreen}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
