/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ObservableQuizMultipleChoiceScreen } from '@ulangi/ulangi-observable';

import { MultipleChoiceFormDelegate } from '../../delegates/multiple-choice/MultipleChoiceFormDelegate';
import { QuizMultipleChoiceScreenDelegate } from '../../delegates/quiz/QuizMultipleChoiceScreenDelegate';
import { MultipleChoiceQuestionIterator } from '../../iterators/MultipleChoiceQuestionIterator';
import { ScreenFactory } from '../ScreenFactory';

export class QuizMultipleChoiceScreenFactory extends ScreenFactory {
  public createScreenDelegate(
    questionIterator: MultipleChoiceQuestionIterator,
    observableScreen: ObservableQuizMultipleChoiceScreen,
    startMultipleChoiceQuiz: () => void
  ): QuizMultipleChoiceScreenDelegate {
    const navigatorDelegate = this.createNavigatorDelegate();

    const multipleChoiceFormDelegate = new MultipleChoiceFormDelegate(
      this.observer,
      observableScreen.multipleChoiceFormState,
      observableScreen.multipleChoiceResult
    );

    return new QuizMultipleChoiceScreenDelegate(
      this.observer,
      questionIterator,
      observableScreen,
      multipleChoiceFormDelegate,
      navigatorDelegate,
      startMultipleChoiceQuiz
    );
  }
}
