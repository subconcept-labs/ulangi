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
import * as React from 'react';

import { LevelBreakdownScreenDelegate } from '../../delegates/level/LevelBreakdownScreenDelegate';
import { Screen } from '../common/Screen';
import { LightBoxContainerWithTitle } from '../light-box/LightBoxContainerWithTitle';
import { LevelBreakdown } from './LevelBreakdown';
import {
  LevelBreakdownScreenStyles,
  levelBreakdownScreenResponsiveStyles,
  lightBoxContainerWithTitleResponsiveStyles,
} from './LevelBreakdownScreen.style';

export interface LevelBreakdownScreenProps {
  themeStore: ObservableThemeStore;
  observableLightBox: ObservableLightBox;
  observableScreen: ObservableScreen;
  levelCounts: {
    readonly totalCount: number;
    readonly level0Count: number;
    readonly level1To3Count: number;
    readonly level4To6Count: number;
    readonly level7To8Count: number;
    readonly level9To10Count: number;
  };
  screenDelegate: LevelBreakdownScreenDelegate;
}

@observer
export class LevelBreakdownScreen extends React.Component<
  LevelBreakdownScreenProps
> {
  private get styles(): LevelBreakdownScreenStyles {
    return levelBreakdownScreenResponsiveStyles.compile(
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
          styles={lightBoxContainerWithTitleResponsiveStyles}
          title="Level Breakdown">
          <LevelBreakdown
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            levelCounts={this.props.levelCounts}
          />
        </LightBoxContainerWithTitle>
      </Screen>
    );
  }
}
