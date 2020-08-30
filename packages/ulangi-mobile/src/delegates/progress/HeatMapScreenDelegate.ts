import { ScreenName } from '@ulangi/ulangi-common/enums';
import { HeatMapDelegate } from '@ulangi/ulangi-delegate';
import { boundClass } from 'autobind-decorator';

import { SecondaryScreenStyle } from '../../styles/SecondaryScreenStyle';
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

  public showHeatMapDataPoint(date: Date, value: string | number): void {
    this.navigatorDelegate.showLightBox(
      ScreenName.HEAT_MAP_DATA_POINT_SCREEN,
      {
        date,
        value,
      },
      SecondaryScreenStyle.LIGHT_BOX_SCREEN_STYLES,
    );
  }

  public switchLayout(): void {
    this.heatMapDelegate.switchLayout();
  }
}
