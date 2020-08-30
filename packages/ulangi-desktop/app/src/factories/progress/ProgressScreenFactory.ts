import {
  DateRangeDelegate,
  HeatMapDelegate,
  StatisticsDelegate,
} from '@ulangi/ulangi-delegate';
import { ObservableProgressScreen } from '@ulangi/ulangi-observable';

import { ProgressScreenDelegate } from '../../delegates/progress/ProgressScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class ProgressScreenFactory extends ScreenFactory {
  public createDateRangeDelegate(): DateRangeDelegate {
    return new DateRangeDelegate();
  }

  public createScreenDelegate(
    observableScreen: ObservableProgressScreen,
  ): ProgressScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const statisticsDelegate = new StatisticsDelegate(
      this.eventBus,
      observableScreen.statisticsState,
    );

    const heatMapDelegate = new HeatMapDelegate(
      this.eventBus,
      observableScreen.heatMapState,
    );

    return new ProgressScreenDelegate(
      this.eventBus,
      observableScreen,
      statisticsDelegate,
      heatMapDelegate,
      navigatorDelegate,
    );
  }
}
