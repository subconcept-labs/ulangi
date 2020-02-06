/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Options } from '@ulangi/react-native-navigation';
import { ScreenName, Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableMultipleChoiceFormState,
  ObservableMultipleChoiceResult,
  ObservableQuizMultipleChoiceScreen,
  ObservableTitleTopBar,
  ObservableTopBarButton,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { ObservableMap, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
import { config } from '../../constants/config';
import { QuizMultipleChoiceScreenIds } from '../../constants/ids/QuizMultipleChoiceScreenIds';
import { QuizMultipleChoiceScreenFactory } from '../../factories/quiz/QuizMultipleChoiceScreenFactory';
import { MultipleChoiceQuestionIterator } from '../../iterators/MultipleChoiceQuestionIterator';
import { QuizMultipleChoiceScreen } from './QuizMultipleChoiceScreen';
import { QuizMultipleChoiceScreenStyle } from './QuizMultipleChoiceScreenContainer.style';

export interface QuizMultipleChoiceScreenPassedProps {
  readonly vocabularyList: ObservableMap<string, ObservableVocabulary>;
  readonly startMultipleChoiceQuiz: () => void;
}

@observer
export class QuizMultipleChoiceScreenContainer extends Container<
  QuizMultipleChoiceScreenPassedProps
> {
  public static options(props: ContainerPassedProps): Options {
    return props.theme === Theme.LIGHT
      ? QuizMultipleChoiceScreenStyle.SCREEN_FULL_LIGHT_STYLES
      : QuizMultipleChoiceScreenStyle.SCREEN_FULL_DARK_STYLES;
  }

  private screenFactory = new QuizMultipleChoiceScreenFactory(
    this.props,
    this.eventBus,
    this.observer,
  );

  private questionIterator = new MultipleChoiceQuestionIterator(
    this.props.passedProps.vocabularyList,
  );

  protected observableScreen = new ObservableQuizMultipleChoiceScreen(
    new ObservableMultipleChoiceFormState(
      this.questionIterator.current(),
      0,
      this.questionIterator.getNumberOfQuestions(),
      [],
      null,
    ),
    new ObservableMultipleChoiceResult(config.quiz.gradeScale, 0, 0),
    observable.box(false),
    ScreenName.QUIZ_MULTIPLE_CHOICE_SCREEN,
    new ObservableTitleTopBar(
      'Multiple Choice',
      new ObservableTopBarButton(
        QuizMultipleChoiceScreenIds.BACK_BTN,
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

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.questionIterator,
    this.observableScreen,
    this.props.passedProps.startMultipleChoiceQuiz,
  );

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? QuizMultipleChoiceScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : QuizMultipleChoiceScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <QuizMultipleChoiceScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
