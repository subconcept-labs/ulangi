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
  ObservableTitleTopBar,
  ObservableTopBarButton,
  ObservableVocabulary,
  ObservableWritingFormState,
  ObservableWritingResult,
} from '@ulangi/ulangi-observable';
import { ObservableMap, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Container, ContainerPassedProps } from '../../Container';
import { Images } from '../../constants/Images';
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
    this.observer,
  );

  private questionIterator = new WritingQuestionIterator(
    this.props.passedProps.vocabularyList,
  );

  private quizSettingsDelegate = this.screenFactory.createQuizSettingsDelegate();

  private currentSettings = this.quizSettingsDelegate.getCurrentSettings();

  protected observableScreen = new ObservableQuizWritingScreen(
    0,
    new ObservableWritingFormState(
      false,
      null,
      this.questionIterator.current(),
      '',
      '',
      0,
      this.questionIterator.getNumberOfQuestions(),
      0,
      false,
    ),
    new ObservableWritingResult(
      config.writing.gradeScale,
      observable.array([]),
      observable.array([]),
      observable.array([]),
      observable.array([]),
    ),
    observable.box(false),
    ScreenName.QUIZ_WRITING_SCREEN,
    new ObservableTitleTopBar(
      'Writing',
      new ObservableTopBarButton(
        QuizWritingScreenIds.BACK_BTN,
        null,
        {
          light: Images.ARROW_LEFT_BLACK_22X22,
          dark: Images.ARROW_LEFT_MILK_22X22,
        },
        (): void => {
          this.screenDelegate.quit();
        },
      ),
      null,
    ),
  );

  private navigatorDelegate = this.screenFactory.createNavigatorDelegate();

  private screenDelegate = this.screenFactory.createScreenDelegate(
    this.questionIterator,
    this.observableScreen,
    this.props.passedProps.startWritingQuiz,
  );

  public componentDidAppear(): void {
    this.observableScreen.screenAppearedTimes += 1;

    if (this.observableScreen.screenAppearedTimes === 1) {
      this.observableScreen.writingFormState.shouldAutoFocus = this.currentSettings.writingAutoShowKeyboard;
    }
  }

  protected onThemeChanged(theme: Theme): void {
    this.navigatorDelegate.mergeOptions(
      theme === Theme.LIGHT
        ? QuizWritingScreenStyle.SCREEN_LIGHT_STYLES_ONLY
        : QuizWritingScreenStyle.SCREEN_DARK_STYLES_ONLY,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <QuizWritingScreen
        themeStore={this.props.rootStore.themeStore}
        observableScreen={this.observableScreen}
        screenDelegate={this.screenDelegate}
      />
    );
  }
}
