import { ActivityState, ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableHeatMapScreen,
  ObservableHeatMapState,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';

import { Container } from '../../Container';
import { HeatMapScreenFactory } from '../../factories/progress/HeatMapScreenFactory';
import { HeatMapScreen } from './HeatMapScreen';

@observer
export class HeatMapScreenContainer extends Container {
  private screenFactory = new HeatMapScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private dateRangeDelegate = this.screenFactory.createDateRangeDelegate();

  protected observableScreen = new ObservableHeatMapScreen(
    new ObservableHeatMapState(
      this.dateRangeDelegate.createRangeByYear(moment().year()),
      null,
      'month-by-month',
      ActivityState.INACTIVE,
    ),
    this.props.componentId,
    ScreenName.HEAT_MAP_SCREEN,
    new ObservableTitleTopBar('Heat Map', null, null),
  );

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.getHeatMapData();
  }

  public render(): React.ReactElement {
    return (
      <HeatMapScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
