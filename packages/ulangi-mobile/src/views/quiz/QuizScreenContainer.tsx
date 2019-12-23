/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import { ObservableQuizScreen } from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
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

  private quizScreenFactory = new QuizScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableQuizScreen(
    this.props.passedProps.selectedCategoryNames,
    ScreenName.QUIZ_SCREEN,
  );

  private navigatorDelegate = this.quizScreenFactory.createNavigatorDelegate();

  private screenDelegate = this.quizScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === QuizScreenIds.BACK_BTN) {
      this.navigatorDelegate.pop();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? QuizScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : QuizScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <QuizScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
