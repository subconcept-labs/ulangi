/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableForgotPasswordScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { ForgotPasswordScreenFactory } from '../../factories/auth/ForgotPasswordScreenFactory';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { ForgotPasswordScreenStyle } from './ForgotPasswordScreenContainer.style';

@observer
export class ForgotPasswordScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? ForgotPasswordScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : ForgotPasswordScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new ForgotPasswordScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableForgotPasswordScreen(
    '',
    ScreenName.FORGOT_PASSWORD_SCREEN,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? ForgotPasswordScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : ForgotPasswordScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <ForgotPasswordScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
