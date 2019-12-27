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
  ObservableTitleTopBar,
  ObservableTopBarButton,
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

  private quizScreenFactory = new QuizScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  protected observableScreen = new ObservableQuizScreen(
    this.props.passedProps.selectedCategoryNames,
    ScreenName.QUIZ_SCREEN,
    new ObservableTitleTopBar(
      '',
      new ObservableTopBarButton(
        QuizScreenIds.BACK_BTN,
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

  private navigatorDelegate = this.quizScreenFactory.createNavigatorDelegate();

  private screenDelegate = this.quizScreenFactory.createScreenDelegate(
    this.observableScreen,
  );

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
