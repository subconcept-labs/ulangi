/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';

import { ObservableMultipleChoiceQuestion } from './ObservableMultipleChoiceQuestion';

export class ObservableMultipleChoiceFormState {
  @observable
  public currentQuestion: ObservableMultipleChoiceQuestion;

  // Note index starts from 0
  @observable
  public currentQuestionIndex: number;

  @observable
  public numOfQuestions: number;

  @observable
  public selectedAnswers: string[];

  @observable
  public containerAnimation: 'fadeOutDown' | 'shake' | null;

  @computed
  public get hasCorrectAnswer(): boolean {
    const possibleCorrectAnswers = this.currentQuestion.testingVocabulary.definitions.map(
      (definition): string => definition.meaning
    );
    return (
      _.intersection(this.selectedAnswers, possibleCorrectAnswers).length > 0
    );
  }

  @action
  public setUpNextQuestion(
    nextQuestion: ObservableMultipleChoiceQuestion
  ): void {
    this.currentQuestion = nextQuestion;
    this.currentQuestionIndex++;
    this.selectedAnswers = [];
  }

  public isAnswerCorrect(answer: string): boolean {
    const possibleCorrectAnswers = this.currentQuestion.testingVocabulary.definitions.map(
      (definition): string => definition.meaning
    );
    return _.includes(possibleCorrectAnswers, answer);
  }

  public constructor(
    currentQuestion: ObservableMultipleChoiceQuestion,
    currentQuestionIndex: number,
    numOfQuestions: number,
    selectedAnswers: string[],
    containerAnimation: 'fadeOutDown' | 'shake' | null
  ) {
    this.currentQuestion = currentQuestion;
    this.currentQuestionIndex = currentQuestionIndex;
    this.numOfQuestions = numOfQuestions;
    this.selectedAnswers = selectedAnswers;
    this.containerAnimation = containerAnimation;
  }
}
