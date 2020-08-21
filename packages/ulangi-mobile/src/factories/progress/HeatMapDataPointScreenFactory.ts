import { HeatMapDataPointScreenDelegate } from '../../delegates/progress/HeatMapDataPointScreenDelegate';
import { ScreenFactory } from '../ScreenFactory';

export class HeatMapDataPointScreenFactory extends ScreenFactory {
  public createScreenDelegate(): HeatMapDataPointScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    return new HeatMapDataPointScreenDelegate(navigatorDelegate);
  }
}
