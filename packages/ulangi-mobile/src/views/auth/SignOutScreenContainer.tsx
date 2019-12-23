/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { SignOutScreenFactory } from '../../factories/auth/SignOutScreenFactory';
import { SignOutScreen } from './SignOutScreen';
import { SignOutScreenStyle } from './SignOutScreenContainer.style';

@observer
export class SignOutScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SignOutScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SignOutScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new SignOutScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableScreen(ScreenName.SIGN_OUT_SCREEN);

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public componentDidMount(): void {
    // Make sure all screens are unmounted before calling signOut
    this.observer.when(
      (): boolean =>
        this.screenDelegate.didAllScreenNameUnmountedExceptSignOutScreen(),
      (): void => {
        this.screenDelegate.signOut();
      },
    );
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SignOutScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SignOutScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return <SignOutScreen />;
  }
}
