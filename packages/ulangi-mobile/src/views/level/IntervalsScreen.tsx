/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableLightBox,
  ObservableScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { View } from 'react-native';

import { IntervalsScreenDelegate } from '../../delegates/level/IntervalsScreenDelegate';
import { DefaultText } from '../common/DefaultText';
import { Screen } from '../common/Screen';
import { LightBoxContainerWithTitle } from '../light-box/LightBoxContainerWithTitle';
import {
  IntervalsScreenStyles,
  intervalsScreenResponsiveStyles,
} from './IntervalsScreen.style';

export interface IntervalsScreenProps {
  themeStore: ObservableThemeStore;
  levelIntervalPairs: readonly [number, number][];
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  screenDelegate: IntervalsScreenDelegate;
}

@observer
export class IntervalsScreen extends React.Component<IntervalsScreenProps> {
  private get styles(): IntervalsScreenStyles {
    return intervalsScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        useSafeAreaView={false}
        observableScreen={this.props.observableScreen}
        style={this.styles.screen}>
        <LightBoxContainerWithTitle
          theme={this.props.themeStore.theme}
          observableLightBox={this.props.observableLightBox}
          screenLayout={this.props.observableScreen.screenLayout}
          dismissLightBox={this.props.screenDelegate.dismissLightBox}
          title="Intervals">
          {this.props.levelIntervalPairs.map(
            ([level, interval]): React.ReactElement<any> => {
              return (
                <View key={level} style={this.styles.row}>
                  <View style={this.styles.row_left}>
                    <DefaultText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={this.styles.level}>
                      {'Level ' + level}
                    </DefaultText>
                  </View>
                  <View style={this.styles.row_right} accessible={true}>
                    <DefaultText style={this.styles.interval}>
                      {moment()
                        .add(interval, 'hours')
                        .toNow(true)}
                    </DefaultText>
                  </View>
                </View>
              );
            },
          )}
        </LightBoxContainerWithTitle>
      </Screen>
    );
  }
}
