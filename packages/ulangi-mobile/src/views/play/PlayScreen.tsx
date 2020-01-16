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

import { PlayScreenIds } from '../../constants/ids/PlayScreenIds';
import { PlayScreenDelegate } from '../../delegates/play/PlayScreenDelegate';
import { TipBar } from '../common/TipBar';
import { PlayList } from './PlayList';

export interface PlayScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  screenDelegate: PlayScreenDelegate;
}

@observer
export class PlayScreen extends React.Component<PlayScreenProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.screen} testID={PlayScreenIds.SCREEN}>
        <TipBar
          theme={this.props.themeStore.theme}
          navigateToWhatToUseScreen={
            this.props.screenDelegate.navigateToWhatToUseScreen
          }
        />
        <PlayList
          navigateToAtomScreen={this.props.screenDelegate.navigateToAtomScreen}
          navigateToReflexScreen={
            this.props.screenDelegate.navigateToReflexScreen
          }
          navigateToFlashcardPlayerScreen={
            this.props.screenDelegate.navigateToFlashcardPlayerScreen
          }
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
