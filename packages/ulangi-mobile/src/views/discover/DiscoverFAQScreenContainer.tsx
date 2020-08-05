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
import { DiscoverFAQScreenIds } from '../../constants/ids/DiscoverFAQScreenIds';
import { DiscoverFAQScreenFactory } from '../../factories/discover/DiscoverFAQScreenFactory';
import { DiscoverFAQScreen } from './DiscoverFAQScreen';
import { DiscoverFAQScreenStyle } from './DiscoverFAQScreenContainer.style';

@observer
export class DiscoverFAQScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? DiscoverFAQScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : DiscoverFAQScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.SPACED_REPETITION_FAQ_SCREEN,
    new ObservableTitleTopBar(
      'Tips',
      new ObservableTopBarButton(
        DiscoverFAQScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.navigatorDelegate.dismissScreen();
        },
      ),
      null,
    ),
  );

  private screenFactory = new DiscoverFAQScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? DiscoverFAQScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : DiscoverFAQScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <DiscoverFAQScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
      />
    );
  }
}
