/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableReflexGameState } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { ReflexScreenIds } from '../../constants/ids/ReflexScreenIds';

export interface ReflexTopBarProps {
  onIconPressed: () => void;
  gameState: ObservableReflexGameState;
}

@observer
export class ReflexTopBar extends React.Component<ReflexTopBarProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID={
            this.props.gameState.started
              ? ReflexScreenIds.PAUSE_BTN
              : ReflexScreenIds.BACK_BTN
          }
          hitSlop={{ top: 10, bottom: 10, left: 25, right: 25 }}
          style={styles.button}
          onPress={this.props.onIconPressed}>
          {this.props.gameState.started === true ? (
            <Image source={Images.PAUSE_WHITE_22X22} />
          ) : (
            <Image source={Images.ARROW_LEFT_WHITE_22X22} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  button: {},

  score_container: {},

  score_text: {
    fontFamily: 'JosefinSans-bold',
    fontSize: 20,
    color: '#efecca',
  },
});
