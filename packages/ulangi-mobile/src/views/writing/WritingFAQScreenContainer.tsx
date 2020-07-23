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
import { WritingFAQScreenIds } from '../../constants/ids/WritingFAQScreenIds';
import { ScreenFactory } from '../../factories/ScreenFactory';
import { WritingFAQScreen } from './WritingFAQScreen';
import { WritingFAQScreenStyle } from './WritingFAQScreenContainer.style';

@observer
export class WritingFAQScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? WritingFAQScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : WritingFAQScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.WRITING_FAQ_SCREEN,
    new ObservableTitleTopBar(
      'FAQ',
      new ObservableTopBarButton(
        WritingFAQScreenIds.BACK_BTN,
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
        ? WritingFAQScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : WritingFAQScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return <WritingFAQScreen themeStore={this.props.rootStore.themeStore} />;
  }
}
