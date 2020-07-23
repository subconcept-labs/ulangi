import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { EventLogsScreenIds } from '../../constants/ids/EventLogsScreenIds';
import { EventLogsScreenFactory } from '../../factories/event/EventLogsScreenFactory';
import { EventLogsScreen } from './EventLogsScreen';
import { EventLogsScreenStyle } from './EventLogsScreenContainer.style';

@observer
export class EventLogsScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? EventLogsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : EventLogsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.EVENT_LOGS_SCREEN,
    new ObservableTitleTopBar(
      'Event Logs',
      new ObservableTopBarButton(
        EventLogsScreenIds.BACK_BTN,
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

  private screenFactory = new EventLogsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? EventLogsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : EventLogsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <EventLogsScreen
        themeStore={this.props.rootStore.themeStore}
        eventStore={this.props.rootStore.eventStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
