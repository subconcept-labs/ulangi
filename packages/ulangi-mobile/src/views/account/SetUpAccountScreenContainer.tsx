/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSetUpAccountScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { SetUpAccountScreenIds } from '../../constants/ids/SetUpAccountScreenIds';
import { SetUpAccountScreenFactory } from '../../factories/account/SetUpAccountScreenFactory';
import { SetUpAccountScreen } from './SetUpAccountScreen';
import { SetUpAccountScreenStyle } from './SetUpAccountScreenContainer.style';

@observer
export class SetUpAccountScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SetUpAccountScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SetUpAccountScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SetUpAccountScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableSetUpAccountScreen(
    '',
    '',
    '',
    ScreenName.SET_UP_ACCOUNT_SCREEN,
    new ObservableTitleTopBar(
      'Set Up Account',
      new ObservableTopBarButton(
        SetUpAccountScreenIds.BACK_BTN,
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

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SetUpAccountScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SetUpAccountScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SetUpAccountScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
