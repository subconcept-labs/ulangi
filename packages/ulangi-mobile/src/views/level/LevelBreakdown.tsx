/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { config } from '../../constants/config';
import { DefaultText } from '../common/DefaultText';
import {
  LevelBreakdownStyles,
  darkStyles,
  lightStyles,
} from './LevelBreakdown.style';
import { LevelSingleBar } from './LevelSingleBar';

export interface LevelBreakdownProps {
  theme: Theme;
  levelCounts: {
    readonly totalCount: number;
    readonly level0Count: number;
    readonly level1To3Count: number;
    readonly level4To6Count: number;
    readonly level7To8Count: number;
    readonly level9To10Count: number;
  };
  styles?: {
    light: LevelBreakdownStyles;
    dark: LevelBreakdownStyles;
  };
}

@observer
export class LevelBreakdown extends React.Component<LevelBreakdownProps> {
  public get styles(): LevelBreakdownStyles {
    const light = this.props.styles ? this.props.styles.light : lightStyles;
    const dark = this.props.styles ? this.props.styles.dark : darkStyles;
    return this.props.theme === Theme.LIGHT ? light : dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        {this.countPerLevelPairs.map(
          ([level, count], index): React.ReactElement<any> => {
            return (
              <View key={level} style={this.styles.row_container}>
                <DefaultText style={this.styles.level}>{level}</DefaultText>
                <LevelSingleBar
                  theme={this.props.theme}
                  color={config.level.colorMap[index]}
                  percentage={count / this.props.levelCounts.totalCount}
                />
                <DefaultText style={this.styles.count}>{count}</DefaultText>
              </View>
            );
          }
        )}
      </View>
    );
  }

  protected get countPerLevelPairs(): [string, number][] {
    return [
      ['Lv\n0', this.props.levelCounts.level0Count],
      ['Lv\n1-3', this.props.levelCounts.level1To3Count],
      ['Lv\n4-6', this.props.levelCounts.level4To6Count],
      ['Lv\n7-8', this.props.levelCounts.level7To8Count],
      ['Lv\n9-10', this.props.levelCounts.level9To10Count],
    ];
  }
}
