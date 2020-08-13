/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableBrowserScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { BrowserScreenIds } from '../../constants/ids/BrowserScreenIds';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { BrowserScreen } from './BrowserScreen';
import { BrowserScreenStyle } from './BrowserScreenContainer.style';

export interface BrowserScreenPassedProps {
  screenTitle: string;
  link: string;
}

@observer
export class BrowserScreenContainer extends Container<
  BrowserScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? BrowserScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : BrowserScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableBrowserScreen(
    this.props.passedProps.link,
    this.props.componentId,
    ScreenName.BROWSER_SCREEN,
    new ObservableTitleTopBar(
      this.props.passedProps.screenTitle,
      new ObservableTopBarButton(
        BrowserScreenIds.BACK_BTN,
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

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? BrowserScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : BrowserScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <BrowserScreen
        observableScreen={this.observableScreen}
        themeStore={this.props.rootStore.themeStore}
      />
    );
  }
}
