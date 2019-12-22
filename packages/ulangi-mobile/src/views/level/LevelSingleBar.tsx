/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export interface LevelSingleBarProps {
  theme: Theme;
  color: string;
  percentage: number;
}

export class LevelSingleBar extends React.Component<LevelSingleBarProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.part,
            {
              backgroundColor: this.props.color,
              flex: this.props.percentage,
            },
          ]}
        />
        <View
          style={[
            styles.part,
            {
              flex: 1 - this.props.percentage,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  part: {
    height: 10,
    borderRadius: 5,
  },
});
