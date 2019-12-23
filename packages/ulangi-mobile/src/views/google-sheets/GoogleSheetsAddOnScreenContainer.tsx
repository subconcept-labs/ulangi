/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableGoogleSheetsAddOnScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { GoogleSheetsAddOnScreenIds } from '../../constants/ids/GoogleSheetsAddOnScreenIds';
import { GoogleSheetsAddOnScreenFactory } from '../../factories/google-sheets/GoogleSheetsAddOnScreenFactory';
import { GoogleSheetsAddOnScreenStyle } from './GoogleSheetsAddOnScreenContainer.style';
import { GoogleSheetsAddOnScreen } from './GoogleSheetsAddonScreen';

@observer
export class GoogleSheetsAddOnScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? GoogleSheetsAddOnScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : GoogleSheetsAddOnScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableGoogleSheetsAddOnScreen(
    '',
    undefined,
    undefined,
    ScreenName.GOOGLE_SHEETS_ADD_ON_SCREEN,
  );

  private screenFactory = new GoogleSheetsAddOnScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === GoogleSheetsAddOnScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? GoogleSheetsAddOnScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : GoogleSheetsAddOnScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <GoogleSheetsAddOnScreen
        userStore={this.props.rootStore.userStore}
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
