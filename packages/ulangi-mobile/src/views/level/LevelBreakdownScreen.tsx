/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableDarkModeStore,
  ObservableLightBox,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { LevelBreakdownScreenDelegate } from '../../delegates/level/LevelBreakdownScreenDelegate';
import { LightBoxContainerWithTitle } from '../light-box/LightBoxContainerWithTitle';
import {
  lightBoxContainerWithTitleDarkStyles,
  lightBoxContainerWithTitleLightStyles,
} from './LevelBreakScreen.style';
import { LevelBreakdown } from './LevelBreakdown';

export interface LevelBreakdownScreenProps {
  darkModeStore: ObservableDarkModeStore;
  observableLightBox: ObservableLightBox;
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
  public render(): React.ReactElement<any> {
    return (
      <LightBoxContainerWithTitle
        theme={this.props.darkModeStore.theme}
        observableLightBox={this.props.observableLightBox}
        dismissLightBox={this.props.screenDelegate.dismissLightBox}
        styles={{
          light: lightBoxContainerWithTitleLightStyles,
          dark: lightBoxContainerWithTitleDarkStyles,
        }}
        title="Level Breakdown">
        <LevelBreakdown
          theme={this.props.darkModeStore.theme}
          levelCounts={this.props.levelCounts}
        />
      </LightBoxContainerWithTitle>
    );
  }
}
