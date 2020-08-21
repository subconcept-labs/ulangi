import { ObservableProgressScreen } from '@ulangi/ulangi-observable';

import { DateRangeDelegate } from '../../delegates/progress/DateRangeDelegate';
import { HeatMapDelegate } from '../../delegates/progress/HeatMapDelegate';
import { ProgressScreenDelegate } from '../../delegates/progress/ProgressScreenDelegate';
import { StatisticsDelegate } from '../../delegates/progress/StatisticsDelegate';
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
