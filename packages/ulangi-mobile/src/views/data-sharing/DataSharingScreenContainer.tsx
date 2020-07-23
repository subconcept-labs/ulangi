import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableDataSharingScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { DataSharingScreenIds } from '../../constants/ids/DataSharingScreenIds';
import { DataSharingScreenFactory } from '../../factories/data-sharing/DataSharingScreenFactory';
import { DataSharingScreen } from '../data-sharing/DataSharingScreen';
import { DataSharingScreenStyle } from './DataSharingScreenContainer.style';

@observer
export class DataSharingScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? DataSharingScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : DataSharingScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new DataSharingScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected observableScreen = new ObservableDataSharingScreen(
    this.props.rootStore.userStore.existingCurrentUser.globalDataSharing ||
      false,
    this.props.componentId,
    ScreenName.DATA_SHARING_SCREEN,
    new ObservableTitleTopBar(
      'Data Sharing',
      new ObservableTopBarButton(
        DataSharingScreenIds.BACK_BTN,
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

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? DataSharingScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : DataSharingScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <DataSharingScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
