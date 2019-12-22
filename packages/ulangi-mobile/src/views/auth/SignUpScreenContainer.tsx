/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableSignUpScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { SignUpScreenFactory } from '../../factories/auth/SignUpScreenFactory';
import { SignUpScreen } from './SignUpScreen';
import { SignUpScreenStyle } from './SignUpScreenContainer.style';

@observer
export class SignUpScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SignUpScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SignUpScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SignUpScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  protected observableScreen = new ObservableSignUpScreen(
    '',
    '',
    '',
    false,
    false,
    ScreenName.SIGN_UP_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SignUpScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SignUpScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SignUpScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
