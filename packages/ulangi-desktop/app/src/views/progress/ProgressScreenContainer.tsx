import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableHeatMapState,
  ObservableProgressScreen,
  ObservableStatisticsState,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { ProgressScreenFactory } from '../../factories/progress/ProgressScreenFactory';
import { ProgressScreen } from './ProgressScreen';

@observer
export class ProgressScreenContainer extends Container {
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
      this.dateRangeDelegate.createRangeByNumberOfDays(60),
      null,
      'continuous',
      ActivityState.INACTIVE,
    ),
    observable.box(false),
    this.props.componentId,
    ScreenName.PROGRESS_SCREEN,
    new ObservableTitleTopBar('Progress', null, null),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.autoShowRefreshNotice();
  }

  public componentDidAppear(): void {
    console.log('didAppear');
    this.observableScreen.screenAppearedTimes += 1;

    if (
      this.observableScreen.screenAppearedTimes === 1 ||
      this.observableScreen.shouldShowRefreshNotice.get()
    ) {
      this.screenDelegate.refresh();
    }
  }

  public componentDidDisappear(): void {
    console.log('didDisappear');
  }

  public render(): React.ReactElement<any> {
    return (
      <ProgressScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
