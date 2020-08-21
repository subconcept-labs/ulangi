import { ScreenName } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container } from '../../Container';
import { HeatMapDataPointScreenFactory } from '../../factories/progress/HeatMapDataPointScreenFactory';
import { HeatMapDataPointScreen } from './HeatMapDataPointScreen';

export interface HeatMapDataPointScreenPassedProps {
  date: Date;
  value: string | number;
}

@observer
export class HeatMapDataPointScreenContainer extends Container<
  HeatMapDataPointScreenPassedProps
> {
  private screenFactory = new HeatMapDataPointScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.HEAT_MAP_DATA_POINT_SCREEN,
    new ObservableTitleTopBar('Heat Map', null, null),
  );

  public render(): React.ReactElement<any> {
    return (
      <HeatMapDataPointScreen
        themeStore={this.props.rootStore.themeStore}
        observableLightBox={this.props.observableLightBox}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
        date={this.props.passedProps.date}
        value={this.props.passedProps.value}
      />
    );
  }
}
