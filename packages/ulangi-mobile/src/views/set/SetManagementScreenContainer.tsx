/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import {
  ActivityState,
  ScreenName,
  SetStatus,
  Theme,
} from '@ulangi/ulangi-common/enums';
import {
  ObservableSetManagementScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { SetManagementScreenIds } from '../../constants/ids/SetManagementScreenIds';
import { SetManagementScreenFactory } from '../../factories/set/SetManagementScreenFactory';
import { SetManagementScreen } from './SetManagementScreen';
import { SetManagementScreenStyle } from './SetManagementScreenContainer.style';

@observer
export class SetManagementScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SetManagementScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SetManagementScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SetManagementScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableSetManagementScreen(
    SetStatus.ACTIVE,
    null,
    ActivityState.INACTIVE,
    false,
    ScreenName.SET_MANAGEMENT_SCREEN,
    new ObservableTitleTopBar(
      'Set Management',
      new ObservableTopBarButton(
        SetManagementScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.pop();
        },
      ),
      new ObservableTopBarButton(
        SetManagementScreenIds.ADD_BTN,
        null,
        {
          light: Images.PLUS_BLACK_22X22,
          dark: Images.PLUS_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.push(ScreenName.ADD_SET_SCREEN, {});
        },
      ),
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public componentDidMount(): void {
    this.screenDelegate.autoRefreshOnSetChange();
    this.screenDelegate.selectAndFetchSets(SetStatus.ACTIVE);
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SetManagementScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SetManagementScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SetManagementScreen
        themeStore={this.props.rootStore.themeStore}
        setStore={this.props.rootStore.setStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
