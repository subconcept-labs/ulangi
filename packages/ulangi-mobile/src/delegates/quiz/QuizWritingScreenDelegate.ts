/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ScreenState } from '@ulangi/ulangi-common/enums';
import {
  ObservableQuizWritingScreen,
  Observer,
} from '@ulangi/ulangi-observable';
import { boundClass } from 'autobind-decorator';
import { Keyboard } from 'react-native';

import { WritingQuestionIterator } from '../../iterators/WritingQuestionIterator';
import { NavigatorDelegate } from '../navigator/NavigatorDelegate';
import { WritingFormDelegate } from '../writing/WritingFormDelegate';

@boundClass
export class QuizWritingScreenDelegate {
  private observer: Observer;
  private questionIterator: WritingQuestionIterator;
  private observableScreen: ObservableQuizWritingScreen;
  private writingFormDelegate: WritingFormDelegate;
  private navigatorDelegate: NavigatorDelegate;
  private startWritingQuiz: () => void;

  public constructor(
    observer: Observer,
    questionIterator: WritingQuestionIterator,
    observableScreen: ObservableQuizWritingScreen,
    writingFormDelegate: WritingFormDelegate,
    navigatorDelegate: NavigatorDelegate,
    startWritingQuiz: () => void
  ) {
    this.observer = observer;
    this.questionIterator = questionIterator;
    this.observableScreen = observableScreen;
    this.navigatorDelegate = navigatorDelegate;
    this.writingFormDelegate = writingFormDelegate;
    this.startWritingQuiz = startWritingQuiz;
  }

  public showHint(): void {
    this.writingFormDelegate.showHint();
  }

  public skip(): void {
    this.writingFormDelegate.skip();
    this.nextQuestion();
  }

  public setAnswer(text: string): void {
    if (
      this.observableScreen.writingFormState.isCurrentAnswerCorrect === false
    ) {
      this.observableScreen.writingFormState.currentAnswer = text;
      this.checkAnswer();
    }
  }

  public checkAnswer(): void {
    if (this.observableScreen.writingFormState.isCurrentAnswerCorrect) {
      Keyboard.dismiss();
      this.writingFormDelegate.recordWhetherHintUsed();
      this.observableScreen.writingFormState.nextButtonType = this.questionIterator.isDone()
        ? 'Done'
        : 'Next';
    }
  }

  public nextQuestion(): void {
    if (this.questionIterator.isDone() === false) {
      this.writingFormDelegate.fadeOut(
        (): void => {
          this.observableScreen.writingFormState.setUpNextQuestion(
            this.questionIterator.next()
          );
        }
      );
    } else {
      this.observableScreen.shouldShowResult.set(true);
    }
  }

  public takeAnotherQuiz(): void {
    this.quit();
    this.observer.when(
      (): boolean =>
        this.observableScreen.screenState === ScreenState.UNMOUNTED,
      (): void => this.startWritingQuiz()
    );
  }

  public quit(): void {
    this.navigatorDelegate.pop();
  }
}
