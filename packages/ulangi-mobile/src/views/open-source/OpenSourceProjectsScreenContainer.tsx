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
import { OpenSourceProjectsScreenIds } from '../../constants/ids/OpenSourceProjectsScreenIds';
import { OpenSourceProjectsScreenFactory } from '../../factories/open-source/OpenSourceProjectsScreenFactory';
import { OpenSourceProjectsScreen } from './OpenSourceProjectsScreen';
import { OpenSourceProjectsScreenStyle } from './OpenSourceProjectsScreenContainer.style';

@observer
export class OpenSourceProjectsScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? OpenSourceProjectsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : OpenSourceProjectsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    ScreenName.OPEN_SOURCE_PROJECTS_SCREEN,
    new ObservableTitleTopBar(
      'Open-Source Projects',
      new ObservableTopBarButton(
        OpenSourceProjectsScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      null,
    ),
  );

  private screenFactory = new OpenSourceProjectsScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? OpenSourceProjectsScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : OpenSourceProjectsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <OpenSourceProjectsScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
