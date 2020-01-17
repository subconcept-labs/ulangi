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
    this.observer,
  );

  protected observableScreen = new ObservableScreen(
    ScreenName.FOLLOW_US_SCREEN,
    new ObservableTitleTopBar(
      'Follow Us',
      new ObservableTopBarButton(
        FollowUsScreenIds.BACK_BTN,
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
        ? FollowUsScreenStyle.SCREEN_LIGHT_STYlES_ONLY
        : FollowUsScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <FollowUsScreen
        themeStore={this.props.rootStore.themeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
