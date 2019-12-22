/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableAtomGameStats } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';

export interface AtomTopBarProps {
  iconTestID: string;
  iconType: 'back' | 'pause';
  gameStats?: ObservableAtomGameStats;
  onPress: () => void;
}

@observer
export class AtomTopBar extends React.Component<AtomTopBarProps> {
  private renderIcon(): React.ReactElement<any> {
    if (this.props.iconType === 'pause') {
      return <Image source={Images.PAUSE_GREEN_22X22} />;
    } else {
      return <Image source={Images.ARROW_LEFT_GREEN_22X22} />;
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID={this.props.iconTestID}
          hitSlop={{ top: 10, bottom: 10, left: 25, right: 25 }}
          style={styles.button}
          onPress={this.props.onPress}
        >
          {this.renderIcon()}
        </TouchableOpacity>
        {typeof this.props.gameStats !== 'undefined' ? (
          <View style={styles.score_container}>
            <DefaultText style={styles.score_text}>
              {this.props.gameStats.score}
            </DefaultText>
          </View>
        ) : null}
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
