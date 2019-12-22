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
import { WelcomeScreenFactory } from '../../factories/welcome/WelcomeScreenFactory';
import { WelcomeScreen } from './WelcomeScreen';
import { WelcomeScreenStyle } from './WelcomeScreenContainer.style';

@observer
export class WelcomeScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WelcomeScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WelcomeScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(ScreenName.WELCOME_SCREEN);

  private screenFactory = new WelcomeScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();
  private screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? WelcomeScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WelcomeScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return <WelcomeScreen screenDelegate={this.screenDelegate} />;
  }
}
