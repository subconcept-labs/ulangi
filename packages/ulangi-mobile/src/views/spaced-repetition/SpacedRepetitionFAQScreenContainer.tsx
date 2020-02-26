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
import { SpacedRepetitionFAQScreenIds } from '../../constants/ids/SpacedRepetitionFAQScreenIds';
import { SpacedRepetitionFAQScreenFactory } from '../../factories/spaced-repetition/SpacedRepetitionFAQScreenFactory';
import { SpacedRepetitionFAQScreen } from './SpacedRepetitionFAQScreen';
import { SpacedRepetitionFAQScreenStyle } from './SpacedRepetitionFAQScreenContainer.style';

@observer
export class SpacedRepetitionFAQScreenContainer extends Container {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? SpacedRepetitionFAQScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : SpacedRepetitionFAQScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  protected observableScreen = new ObservableScreen(
    this.props.componentId,
    ScreenName.SPACED_REPETITION_FAQ_SCREEN,
    new ObservableTitleTopBar(
      'FAQ',
      new ObservableTopBarButton(
        SpacedRepetitionFAQScreenIds.BACK_BTN,
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

  private screenFactory = new SpacedRepetitionFAQScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  protected screenDelegate = this.screenFactory.createScreenDelegate();

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? SpacedRepetitionFAQScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : SpacedRepetitionFAQScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <SpacedRepetitionFAQScreen
        themeStore={this.props.rootStore.themeStore}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
