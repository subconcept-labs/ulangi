/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreenLayout } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import {
  LevelSingleBarStyles,
  levelSingleBarResponsiveStyles,
} from './LevelSingleBar.style';

export interface LevelSingleBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  color: string;
  percentage: number;
}

@observer
export class LevelSingleBar extends React.Component<LevelSingleBarProps> {
  private get styles(): LevelSingleBarStyles {
    return levelSingleBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <View
          style={[
            this.styles.part,
            {
              backgroundColor: this.props.color,
              flex: this.props.percentage,
            },
          ]}
        />
        <View
          style={[
            this.styles.part,
            {
              flex: 1 - this.props.percentage,
            },
          ]}
        />
      </View>
    );
  }
}
