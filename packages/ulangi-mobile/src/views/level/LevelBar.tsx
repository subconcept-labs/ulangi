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

import { config } from '../../constants/config';
import { LevelBarStyles, levelBarResponsiveStyles } from './LevelBar.style';

export interface LevelBarProps {
  theme: Theme;
  screenLayout: ObservableScreenLayout;
  percentages: [number, number, number, number, number];
}

@observer
export class LevelBar extends React.Component<LevelBarProps> {
  private get styles(): LevelBarStyles {
    return levelBarResponsiveStyles.compile(
      this.props.screenLayout,
      this.props.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <View style={this.styles.container}>
        {this.props.percentages
          .map(
            (percentage, index): React.ReactElement<any> => {
              return (
                <View
                  key={index}
                  style={[
                    this.styles.part,
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
