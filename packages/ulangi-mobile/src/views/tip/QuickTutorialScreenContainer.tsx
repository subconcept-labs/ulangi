/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuickTutorialScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { QuickTutorialScreenIds } from '../../constants/ids/QuickTutorialScreenIds';
import { QuickTutorialScreenFactory } from '../../factories/tip/QuickTutorialScreenFactory';
import { QuickTutorialScreen } from './QuickTutorialScreen';
import { QuickTutorialScreenStyle } from './QuickTutorialScreenContainer.style';

@observer
export class QuickTutorialScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? QuickTutorialScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : QuickTutorialScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableQuickTutorialScreen(
    this.props.rootStore.darkModeStore.theme === Theme.LIGHT
      ? Images.QUICK_TUTORIAL_SCREENS.light
      : Images.QUICK_TUTORIAL_SCREENS.dark,
    0,
    ScreenName.QUICK_TUTORIAL_SCREEN,
    new ObservableTitleTopBar(
      'Quick Tutorial',
      new ObservableTopBarButton(
        QuickTutorialScreenIds.BACK_BTN,
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

  private screenFactory = new QuickTutorialScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === QuickTutorialScreenIds.BACK_BTN) {
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? QuickTutorialScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : QuickTutorialScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );

    this.observableScreen.images =
      theme === Theme.LIGHT
        ? Images.QUICK_TUTORIAL_SCREENS.light
        : Images.QUICK_TUTORIAL_SCREENS.dark;
  }

  public render(): React.ReactElement<any> {
    return (
      <QuickTutorialScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
