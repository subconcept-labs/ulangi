/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuizScreen,
  ObservableTopBarButton,
  ObservableTouchableTopBar,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { QuizScreenIds } from '../../constants/ids/QuizScreenIds';
import { QuizScreenFactory } from '../../factories/quiz/QuizScreenFactory';
import { QuizScreen } from '../../views/quiz/QuizScreen';
import { QuizScreenStyle } from './QuizScreenContainer.style';

export interface QuizScreenPassedProps {
  selectedCategoryNames: undefined | string[];
}

@observer
export class QuizScreenContainer extends Container<QuizScreenPassedProps> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? QuizScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : QuizScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new QuizScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private setSelectionMenuDelegate = this.screenFactory.createSetSelectionMenuDelegateWithStyles();

  protected observableScreen = new ObservableQuizScreen(
    this.props.passedProps.selectedCategoryNames,
    this.props.componentId,
    ScreenName.QUIZ_SCREEN,
    new ObservableTouchableTopBar(
      QuizScreenIds.SHOW_SET_SELECTION_MENU_BTN,
      this.setSelectionMenuDelegate.getCurrentSetName(),
      this.setSelectionMenuDelegate.getCurrentFlagIcon(),
      (): void => {
        this.setSelectionMenuDelegate.showActiveSetsForSetSelection();
      },
      new ObservableTopBarButton(
        QuizScreenIds.BACK_BTN,
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

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.observableScreen,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? QuizScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : QuizScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public componentDidMount(): void {
    this.setSelectionMenuDelegate.autoUpdateSubtitleOnSetChange(
      this.observableScreen,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <QuizScreen
        themeStore={this.props.rootStore.themeStore}
        observableDimensions={this.props.observableDimensions}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
