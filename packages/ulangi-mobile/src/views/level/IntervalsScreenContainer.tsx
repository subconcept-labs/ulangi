/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { SpacedRepetitionScheduler } from '@ulangi/ulangi-common/core';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { IntervalsScreenFactory } from '../../factories/level/IntervalsScreenFactory';
import { IntervalsScreen } from '../level/IntervalsScreen';

export interface IntervalsScreenPassedProps {
  readonly initialInterval: number;
  readonly range: [number, number];
}

@observer
export class IntervalsScreenContainer extends Container<
  IntervalsScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }

  private screenFactory = new IntervalsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.INTERVALS_SCREEN,
    null,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  private spacedRepetitionScheduler = new SpacedRepetitionScheduler();

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
      <IntervalsScreen
        themeStore={this.props.rootStore.themeStore}
        observableLightBox={this.props.observableLightBox}
        observableScreen={this.observableScreen}
        levelIntervalPairs={this.spacedRepetitionScheduler.calculateWaitingHoursInRange(
          this.props.passedProps.initialInterval,
          this.props.passedProps.range,
        )}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
