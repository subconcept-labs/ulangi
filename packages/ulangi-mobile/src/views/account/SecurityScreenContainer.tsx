/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

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
import { SecurityScreenIds } from '../../constants/ids/SecurityScreenIds';
import { SecurityScreenFactory } from '../../factories/account/SecurityScreenFactory';
import { SecurityScreen } from '../../views/account/SecurityScreen';
import { SecurityScreenStyle } from './SecurityScreenContainer.style';

@observer
export class SecurityScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SecurityScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SecurityScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SecurityScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableScreen(
    ScreenName.SECURITY_SCREEN,
    new ObservableTitleTopBar(
      'Security',
      new ObservableTopBarButton(
        SecurityScreenIds.BACK_BTN,
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

  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SecurityScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SecurityScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SecurityScreen
        themeStore={this.props.rootStore.themeStore}
        currentUser={this.props.rootStore.userStore.existingCurrentUser}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
