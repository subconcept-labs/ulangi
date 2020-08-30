import { DateRangeDelegate, HeatMapDelegate } from '@ulangi/ulangi-delegate';
import { ObservableHeatMapScreen } from '@ulangi/ulangi-observable';

import { HeatMapScreenDelegate } from '../../delegates/progress/HeatMapScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class HeatMapScreenFactory extends ScreenFactory {
  public createDateRangeDelegate(): DateRangeDelegate {
    return new DateRangeDelegate();
  }

  public createScreenDelegate(
    observableScreen: ObservableHeatMapScreen,
  ): HeatMapScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const heatMapDelegate = new HeatMapDelegate(
      this.eventBus,
      observableScreen.heatMapState,
    );

    return new HeatMapScreenDelegate(heatMapDelegate, navigatorDelegate);
  }
}
