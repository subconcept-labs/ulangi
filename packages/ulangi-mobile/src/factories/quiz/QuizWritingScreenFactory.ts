/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuizWritingScreen } from '@ulangi/ulangi-observable';

import { QuizWritingScreenDelegate } from '../../delegates/quiz/QuizWritingScreenDelegate';
import { WritingFormDelegate } from '../../delegates/writing/WritingFormDelegate';
import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { ScreenFactory } from '../ScreenFactory';

export class QuizWritingScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    questionIterator: WritingQuestionIterator,
    observableScreen: ObservableQuizWritingScreen,
    startWritingQuiz: () => void,
  ): QuizWritingScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const writingFormDelegate = new WritingFormDelegate(
      this.observer,
      observableScreen.writingFormState,
      observableScreen.writingResult,
    );

    return new QuizWritingScreenDelegate(
      this.observer,
      questionIterator,
      observableScreen,
      writingFormDelegate,
      navigatorDelegate,
      startWritingQuiz,
    );
  }
}
