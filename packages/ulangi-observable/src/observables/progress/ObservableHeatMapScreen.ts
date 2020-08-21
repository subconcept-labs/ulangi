import { ScreenName } from '@ulangi/ulangi-common/enums';

import { ObservableScreen } from '../screen/ObservableScreen';
import { ObservableTitleTopBar } from '../top-bar/ObservableTitleTopBar';
import { ObservableHeatMapState } from './ObservableHeatMapState';

export class ObservableHeatMapScreen extends ObservableScreen {
  public readonly heatMapState: ObservableHeatMapState;

  public constructor(
    heatMapState: ObservableHeatMapState,
    componentId: string,
    screenName: ScreenName,
    topBar: ObservableTitleTopBar
  ) {
    super(componentId, screenName, topBar);
    this.heatMapState = heatMapState;
  }
}
