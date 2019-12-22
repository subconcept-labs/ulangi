/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AtomScreenIds } from '../../constants/ids/AtomScreenIds';
import { AtomStyle } from '../../styles/AtomStyle';
import { DefaultButton } from '../common/DefaultButton';

export interface AtomMenuProps {
  start: () => void;
  goToTutorial: () => void;
}

export class AtomMenu extends React.Component<AtomMenuProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <DefaultButton
          testID={AtomScreenIds.PLAY_BTN}
          text="PLAY"
          styles={AtomStyle.getPrimaryMenuButtonStyles()}
          onPress={this.props.start}
        />
        <DefaultButton
          testID={AtomScreenIds.TUTORIAL_BTN}
          text="TUTORIAL"
          styles={AtomStyle.getSecondaryMenuButtonStyles()}
          onPress={this.props.goToTutorial}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
