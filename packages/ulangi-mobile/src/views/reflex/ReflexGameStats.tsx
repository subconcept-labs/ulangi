/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableReflexGameStats,
  ObservableScreenLayout,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { DefaultText } from '../common/DefaultText';
import {
  ReflexGameStatsStyles,
  reflexGameStatsResponsiveStyles,
} from './ReflexGameStats.style';

export interface ReflexGameStatsProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  gameStats: ObservableReflexGameStats;
}

@observer
export class ReflexGameStats extends React.Component<ReflexGameStatsProps> {
  private get styles(): ReflexGameStatsStyles {
    return reflexGameStatsResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        <DefaultText style={this.styles.score_text}>
          {this.props.gameStats.score}
        </DefaultText>
      </View>
    );
  }
}
