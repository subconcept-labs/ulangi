import { Options } from '@ulangi/react-native-navigation';
import { ActivityState, ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableHeatMapScreen,
  ObservableHeatMapState,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { HeatMapScreenIds } from '../../constants/ids/HeatMapScreenIds';
import { HeatMapScreenFactory } from '../../factories/progress/HeatMapScreenFactory';
import { HeatMapScreen } from './HeatMapScreen';
import { HeatMapScreenStyle } from './HeatMapScreenContainer.style';

@observer
export class HeatMapScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? HeatMapScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : HeatMapScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

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
    new ObservableTitleTopBar(
      'Heat Map',
      new ObservableTopBarButton(
        HeatMapScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      null,
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? HeatMapScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : HeatMapScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public componentDidMount(): void {
    this.screenDelegate.getHeatMapData();
  }

  public render(): React.ReactElement<any> {
    return (
      <HeatMapScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
