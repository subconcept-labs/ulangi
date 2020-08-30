import { HeatMapDelegate } from '@ulangi/ulangi-delegate';
import { boundClass } from 'autobind-decorator';

import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class HeatMapScreenDelegate {
  private heatMapDelegate: HeatMapDelegate;
  private navigatorDelegate: NavigatorDelegate;

  public constructor(
    heatMapDelegate: HeatMapDelegate,
    navigatorDelegate: NavigatorDelegate,
  ) {
    this.heatMapDelegate = heatMapDelegate;
    this.navigatorDelegate = navigatorDelegate;
  }

  public getHeatMapData(): void {
    this.heatMapDelegate.getHeatMapData();
  }

  public setLayout(layout: 'continuous' | 'month-by-month'): void {
    this.heatMapDelegate.setLayout(layout);
  }

  public back(): void {
    this.navigatorDelegate.dismissScreen();
  }
}
