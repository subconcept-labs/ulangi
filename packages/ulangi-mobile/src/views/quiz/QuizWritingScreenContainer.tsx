/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuizWritingScreen,
  ObservableVocabulary,
  ObservableWritingFormState,
  ObservableWritingResult,
} from '@ulangi/ulangi-observable';
import { ObservableMap, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { config } from '../../constants/config';
import { QuizWritingScreenIds } from '../../constants/ids/QuizWritingScreenIds';
import { QuizWritingScreenFactory } from '../../factories/quiz/QuizWritingScreenFactory';
import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { QuizWritingScreen } from './QuizWritingScreen';
import { QuizWritingScreenStyle } from './QuizWritingScreenContainer.style';

export interface QuizWritingScreenPassedProps {
  readonly vocabularyList: ObservableMap<string, ObservableVocabulary>;
  readonly startWritingQuiz: () => void;
}

@observer
export class QuizWritingScreenContainer extends Container<
  QuizWritingScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? QuizWritingScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : QuizWritingScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new QuizWritingScreenFactory(
    this.props,
    this.eventBus,
    this.observer
  );

  private questionIterator = new WritingQuestionIterator(
    this.props.passedProps.vocabularyList
  );

  protected observableScreen = new ObservableQuizWritingScreen(
    new ObservableWritingFormState(
      true,
      null,
      this.questionIterator.next(),
      '',
      '',
      0,
      this.questionIterator.getNumberOfQuestions(),
      0,
      false
    ),
    new ObservableWritingResult(
      config.writing.gradeScale,
      observable.array([]),
      observable.array([]),
      observable.array([]),
      observable.array([])
    ),
    observable.box(false),
    ScreenName.QUIZ_WRITING_SCREEN
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.questionIterator,
    this.observableScreen,
    this.props.passedProps.startWritingQuiz
  );

  public navigationButtonPressed({ buttonId }: { buttonId: string }): void {
    if (buttonId === QuizWritingScreenIds.BACK_BTN) {
      this.screenDelegate.quit();
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? QuizWritingScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : QuizWritingScreenStyle.SCREEN_DARK_STYLES_ONLY
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <QuizWritingScreen
        darkModeStore={this.props.rootStore.darkModeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
