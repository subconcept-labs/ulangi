/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSignInScreen,
  ObservableTitleTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { SignInScreenFactory } from '../../factories/auth/SignInScreenFactory';
import { SignInScreen } from './SignInScreen';
import { SignInScreenStyle } from './SignInScreenContainer.style';

@observer
export class SignInScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SignInScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SignInScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SignInScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableSignInScreen(
    '',
    '',
    false,
    ScreenName.SIGN_IN_SCREEN,
    new ObservableTitleTopBar('Sign In', null, null),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createSignInScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SignInScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SignInScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SignInScreen
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
