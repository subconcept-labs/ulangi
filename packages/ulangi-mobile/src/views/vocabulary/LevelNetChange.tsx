/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as React from 'react';
import { Image, StyleSheet, View, ViewProperties } from 'react-native';

import { Images } from '../../constants/Images';
import { DefaultText } from '../common/DefaultText';

export interface LevelNetChangeProps extends ViewProperties {
  netChange: number;
}

export class LevelNetChange extends React.Component<LevelNetChangeProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderContent()}
      </View>
    );
  }

  private renderContent(): React.ReactElement<any> {
    if (this.props.netChange >= 1) {
      return (
        <React.Fragment>
          <DefaultText style={styles.text_green}>(</DefaultText>
          <Image source={Images.ARROW_UP_GREEN_10X8} />
          <DefaultText style={styles.text_green}>
            {this.props.netChange}
          </DefaultText>
          <DefaultText style={styles.text_green}>)</DefaultText>
        </React.Fragment>
      );
    } else if (this.props.netChange === 0) {
      return (
        <DefaultText style={styles.text}>{`(${
          this.props.netChange
        })`}</DefaultText>
      );
    } else {
      return (
        <React.Fragment>
          <DefaultText style={styles.text_red}>(</DefaultText>
          <Image source={Images.ARROW_DOWN_RED_10X8} />
          <DefaultText style={styles.text_red}>
            {Math.abs(this.props.netChange)}
          </DefaultText>
          <DefaultText style={styles.text_red}>)</DefaultText>
        </React.Fragment>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  text: {
    color: '#666',
  },

  text_green: {
    color: 'green',
  },

  text_red: {
    color: 'orangered',
  },
});
