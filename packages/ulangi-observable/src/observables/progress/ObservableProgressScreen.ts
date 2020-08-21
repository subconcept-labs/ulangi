/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenName } from '@ulangi/ulangi-common/enums';
import { IObservableValue, observable } from 'mobx';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableHeatMapState } from './ObservableHeatMapState';
import { ObservableStatisticsState } from './ObservableStatisticsState';

export class ObservableProgressScreen extends ObservableScreen {
  @observable
  public screenAppearedTimes: number;

  public readonly statisticsState: ObservableStatisticsState;
  public readonly heatMapState: ObservableHeatMapState;
  public readonly shouldShowRefreshNotice: IObservableValue<boolean>;

  public constructor(
    screenAppearedTimes: number,
    statisticsState: ObservableStatisticsState,
    heatMapState: ObservableHeatMapState,
    shouldShowRefreshNotice: IObservableValue<boolean>,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.screenAppearedTimes = screenAppearedTimes;
    this.statisticsState = statisticsState;
    this.heatMapState = heatMapState;
    this.shouldShowRefreshNotice = shouldShowRefreshNotice;
  }
}
