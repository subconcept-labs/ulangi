/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { LevelBreakdownScreenFactory } from '../../factories/level/LevelBreakdownScreenFactory';
import { LevelBreakdownScreen } from './LevelBreakdownScreen';

export interface LevelBreakdownScreenPassedProps {
  readonly levelCounts: {
    readonly totalCount: number;
    readonly level0Count: number;
    readonly level1To3Count: number;
    readonly level4To6Count: number;
    readonly level7To8Count: number;
    readonly level9To10Count: number;
  };
}

@observer
export class LevelBreakdownScreenContainer extends Container<
  LevelBreakdownScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    ScreenName.LEVEL_BREAKDOWN_SCREEN,
  );

  private screenFactory = new LevelBreakdownScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    if (typeof this.props.styles !== 'undefined') {
      this.navigatorDelegate.mergeOptions(
        theme === Theme.LIGHT
          ? this.props.styles.light
          : this.props.styles.dark,
      );
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <LevelBreakdownScreen
        observableLightBox={this.observableLightBox}
        darkModeStore={this.props.rootStore.darkModeStore}
        levelCounts={this.props.passedProps.levelCounts}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
