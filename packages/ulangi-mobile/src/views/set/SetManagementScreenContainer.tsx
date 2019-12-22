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
import { ObservableSetManagementScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
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
    this.observer
  );

  protected observableScreen = new ObservableSetManagementScreen(
    SetStatus.ACTIVE,
    null,
    ActivityState.INACTIVE,
    false,
    ScreenName.SET_MANAGEMENT_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  public componentDidMount(): void {
    this.screenDelegate.autoRefreshOnSetChange();
    this.screenDelegate.selectAndFetchSets(SetStatus.ACTIVE);
  }

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === SetManagementScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    } else if (buttonId === SetManagementScreenIds.ADD_BTN) {
      this.navigatorDelegate.push(ScreenName.ADD_SET_SCREEN, {});
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SetManagementScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SetManagementScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SetManagementScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        setStore={this.props.rootStore.setStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
