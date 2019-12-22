/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenState } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuizMultipleChoiceScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import * as _ from 'lodash';

import { MultipleChoiceQuestionIterator } from '../../iterators/MultipleChoiceQuestionIterator';
import { MultipleChoiceFormDelegate } from '../multiple-choice/MultipleChoiceFormDelegate';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';

@boundClass
export class QuizMultipleChoiceScreenDelegate {
  private observer: Observer;
  private questionIterator: MultipleChoiceQuestionIterator;
  private observableScreen: ObservableQuizMultipleChoiceScreen;
  private multipleChoiceFormDelegate: MultipleChoiceFormDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startMultipleChoiceQuiz: () => void;

  public constructor(
    observer: Observer,
    questionIterator: MultipleChoiceQuestionIterator,
    observableScreen: ObservableQuizMultipleChoiceScreen,
    multipleChoiceFormDelegate: MultipleChoiceFormDelegate,
    navigatorDelegate: NavigatorDelegate,
    startMultipleChoiceQuiz: () => void
  ) {
    this.observer = observer;
    this.questionIterator = questionIterator;
    this.observableScreen = observableScreen;
    this.multipleChoiceFormDelegate = multipleChoiceFormDelegate;
    this.navigatorDelegate = navigatorDelegate;
    this.startMultipleChoiceQuiz = startMultipleChoiceQuiz;
  }

  public handleSelectAnswer(answer: string): void {
    this.multipleChoiceFormDelegate.checkAnswer(answer, {
      onAnswerCorrect: (): void => this.nextQuestion(),
      onAnswerIncorrect: _.noop,
    });
  }

  public takeAnotherQuiz(): void {
    this.quit();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => this.startMultipleChoiceQuiz()
    );
  }

  public quit(): void {
    this.navigatorDelegate.pop();
  }

  private nextQuestion(): void {
    if (this.questionIterator.isDone() === false) {
      this.observableScreen.multipleChoiceFormState.setUpNextQuestion(
        this.questionIterator.next()
      );
    } else {
      this.observableScreen.shouldShowResult.set(true);
    }
  }
}
