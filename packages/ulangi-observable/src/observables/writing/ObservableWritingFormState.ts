/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularyExtraFieldParser } from '@ulangi/ulangi-common/core';
import * as changeCase from 'change-case';
import { action, computed, observable } from 'mobx';

import { ObservableWritingQuestion } from './ObservableWritingQuestion';

export class ObservableWritingFormState {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();

  @observable
  public shouldAutoFocus: boolean;

  @observable
  public nextButtonType: null | 'Done' | 'Next';

  @observable
  public currentAnswer: string;

  @observable
  public currentHint: string;

  @observable
  public currentQuestion: ObservableWritingQuestion;

  // index starts from 0
  @observable
  public currentQuestionIndex: number;

  @observable
  public numOfQuestions: number;

  @observable
  public numOfHintsUsedForCurrentQuestion: number;

  @observable
  public shouldRunFadeOutAnimation: boolean;

  @computed
  public get currentAnswerInLowerCase(): string {
    return changeCase.lower(this.currentAnswer);
  }

  @computed
  public get isFirstTimeWritingTheTerm(): boolean {
    return (
      typeof this.currentQuestion.testingVocabulary.writing === 'undefined' ||
      this.currentQuestion.testingVocabulary.writing.lastWrittenAt === null
    );
  }

  @computed
  public get isCurrentAnswerCorrect(): boolean {
    return (
      changeCase.lower(
        this.vocabularyExtraFieldParser.parse(
          this.currentQuestion.testingVocabulary.vocabularyText
        ).vocabularyTerm
      ) === changeCase.lower(this.currentAnswer)
    );
  }

  @computed
  public get isCurrentAnswerPartiallyCorrect(): boolean {
    return (
      changeCase
        .lower(
          this.vocabularyExtraFieldParser.parse(
            this.currentQuestion.testingVocabulary.vocabularyText
          ).vocabularyTerm
        )
        .indexOf(changeCase.lower(this.currentAnswer)) === 0
    );
  }

  @action
  public setUpNextQuestion(nextQuestion: ObservableWritingQuestion): void {
    this.nextButtonType = null;
    this.currentQuestion = nextQuestion;
    this.currentQuestionIndex++;
    this.currentAnswer = '';
    this.currentHint = '';
    this.numOfHintsUsedForCurrentQuestion = 0;
  }

  public constructor(
    shouldAutoFocus: boolean,
    nextButtonType: null | 'Next' | 'Done',
    currentQuestion: ObservableWritingQuestion,
    currentAnswer: string,
    currentHint: string,
    currentQuestionIndex: number,
    numOfQuestions: number,
    numOfHintsUsedForCurrentQuestion: number,
    shouldRunFadeOutAnimation: boolean
  ) {
    this.shouldAutoFocus = shouldAutoFocus;
    this.nextButtonType = nextButtonType;
    this.currentQuestion = currentQuestion;
    this.currentAnswer = currentAnswer;
    this.currentHint = currentHint;
    this.currentQuestionIndex = currentQuestionIndex;
    this.numOfQuestions = numOfQuestions;
    this.numOfHintsUsedForCurrentQuestion = numOfHintsUsedForCurrentQuestion;
    this.shouldRunFadeOutAnimation = shouldRunFadeOutAnimation;
  }
}
