import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableHeatMapState,
  ObservableProgressScreen,
  ObservableStatisticsState,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { ProgressScreenFactory } from '../../factories/progress/ProgressScreenFactory';
import { ProgressScreen } from './ProgressScreen';
import { ProgressScreenStyle } from './ProgressScreenContainer.style';

@observer
export class ProgressScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ProgressScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ProgressScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ProgressScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private dateRangeDelegate = this.screenFactory.createDateRangeDelegate();

  protected observableScreen = new ObservableProgressScreen(
    0,
    new ObservableStatisticsState(null, ActivityState.INACTIVE),
    new ObservableHeatMapState(
      this.dateRangeDelegate.createRangeByNumberOfDays(30),
      null,
      'continuous',
      ActivityState.INACTIVE,
    ),
    observable.box(false),
    this.props.componentId,
    ScreenName.PROGRESS_SCREEN,
    new ObservableTitleTopBar('Progress', null, null),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ProgressScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ProgressScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public componentDidMount(): void {
    this.screenDelegate.autoShowRefreshNotice();
  }

  public componentDidAppear(): void {
    this.observableScreen.screenAppearedTimes += 1;

    if (
      this.observableScreen.screenAppearedTimes === 1 ||
      this.observableScreen.shouldShowRefreshNotice.get()
    ) {
      this.screenDelegate.refresh();
    }
  }

  public render(): React.ReactElement<any> {
    return (
      <ProgressScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
