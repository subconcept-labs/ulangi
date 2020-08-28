import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
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
  public static options(props: ContainerPassedProps): Options {
    if (props.theme === Theme.LIGHT) {
      return props.styles ? props.styles.light : {};
    } else {
      return props.styles ? props.styles.dark : {};
    }
  }
  private screenFactory = new HeatMapDataPointScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private screenDelegate = this.screenFactory.createScreenDelegate();

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected observableLightBox = this.props.observableLightBox;

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.HEAT_MAP_DATA_POINT_SCREEN,
    new ObservableTitleTopBar('Heat Map', null, null),
  );

  protected onThemeChanged(theme: Theme): void {
    if (typeof this.props.styles !== 'undefined') {
      this.navigatorDelegate.mergeOptions(
        theme === Theme.LIGHT
          ? this.props.styles.light
          : this.props.styles.dark,
      );
    }
  }

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
