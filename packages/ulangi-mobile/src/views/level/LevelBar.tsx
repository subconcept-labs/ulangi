/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { config } from '../../constants/config';
import { ss } from '../../utils/responsive';

export interface LevelBarProps {
  theme: Theme;
  percentages: [number, number, number, number, number];
}

export class LevelBar extends React.Component<LevelBarProps> {
  public render(): React.ReactElement<any> {
    return (
      <View style={styles.container}>
        {this.props.percentages
          .map(
            (percentage, index): React.ReactElement<any> => {
              return (
                <View
                  key={index}
                  style={[
                    styles.part,
                    {
                      backgroundColor: config.level.colorMap[index],
                      flex: percentage,
                    },
                  ]}
                />
              );
            },
          )
          .reverse()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: ss(10),
    borderRadius: ss(5),
    overflow: 'hidden',
  },

  part: {},
});
