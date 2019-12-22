/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableMultipleChoiceFormState,
  ObservableMultipleChoiceResult,
  Observer,
} from '@ulangi/ulangi-observable';

export class MultipleChoiceFormDelegate {
  private observer: Observer;
  private multipleChoiceFormState: ObservableMultipleChoiceFormState;
  private multipleChoiceResult: ObservableMultipleChoiceResult;

  public constructor(
    observer: Observer,
    multipleChoiceFormState: ObservableMultipleChoiceFormState,
    multipleChoiceResult: ObservableMultipleChoiceResult
  ) {
    this.observer = observer;
    this.multipleChoiceFormState = multipleChoiceFormState;
    this.multipleChoiceResult = multipleChoiceResult;
  }

  public checkAnswer(
    answer: string,
    callback: {
      onAnswerCorrect: () => void;
      onAnswerIncorrect: () => void;
    }
  ): void {
    this.multipleChoiceFormState.selectedAnswers.push(answer);

    if (this.multipleChoiceFormState.hasCorrectAnswer === true) {
      this.multipleChoiceResult.correctAttempts++;
      this.multipleChoiceFormState.containerAnimation = 'fadeOutDown';
      this.observer.when(
        (): boolean => this.multipleChoiceFormState.containerAnimation === null,
        (): void => {
          callback.onAnswerCorrect();
        }
      );
    } else {
      this.multipleChoiceResult.incorrectAttempts++;
      this.multipleChoiceFormState.containerAnimation = 'shake';
      callback.onAnswerIncorrect();
    }
  }
}
