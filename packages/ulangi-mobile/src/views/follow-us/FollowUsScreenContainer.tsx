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
import { FollowUsScreenIds } from '../../constants/ids/FollowUsScreenIds';
import { FollowUsScreenFactory } from '../../factories/follow-us/FollowUsScreenFactory';
import { FollowUsScreen } from './FollowUsScreen';
import { FollowUsScreenStyle } from './FollowUsScreenContainer.style';

@observer
export class FollowUsScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? FollowUsScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : FollowUsScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new FollowUsScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  protected observableScreen = new ObservableScreen(
    ScreenName.FOLLOW_US_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate();

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === FollowUsScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? FollowUsScreenStyle.SCREEN_LIGHT_STYlES_ONLY
        : FollowUsScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <FollowUsScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
