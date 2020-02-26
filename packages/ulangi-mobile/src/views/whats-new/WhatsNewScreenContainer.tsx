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
import { WhatsNewScreenIds } from '../../constants/ids/WhatsNewScreenIds';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { WhatsNewScreen } from './WhatsNewScreen';
import { WhatsNewScreenStyle } from './WhatsNewScreenContainer.style';

@observer
export class WhatsNewScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WhatsNewScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WhatsNewScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.WHATS_NEW_SCREEN,
    new ObservableTitleTopBar(
      "What's New",
      new ObservableTopBarButton(
        WhatsNewScreenIds.BACK_BTN,
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

  private screenFactory = new ScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? WhatsNewScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WhatsNewScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return <WhatsNewScreen />;
  }
}
