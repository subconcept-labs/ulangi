/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ObservableVocabulary,
  ObservableWritingQuestion,
} from '@ulangi/ulangi-observable';
import { OrderedMap } from 'immutable';
import * as _ from 'lodash';
import * as uuid from 'uuid';

import { RandomVocabularyIterator } from './RandomVocabularyIterator';

export class WritingQuestionIterator {
  private numberOfQuestions: number;

  private randomVocabularyIterator: RandomVocabularyIterator<
    ObservableVocabulary
  >;

  public constructor(vocabularyList?: Map<string, ObservableVocabulary>) {
    this.randomVocabularyIterator = new RandomVocabularyIterator(
      vocabularyList ? OrderedMap(vocabularyList) : undefined,
    );

    this.numberOfQuestions = this.randomVocabularyIterator.getQueueSize();
  }

  public next(): ObservableWritingQuestion {
    const nextVocabulary = this.randomVocabularyIterator.next();
    return this.makeQuestion(nextVocabulary);
  }

  public isDone(): boolean {
    return this.randomVocabularyIterator.isDone();
  }

  public shuffleQueue(): void {
    this.randomVocabularyIterator.shuffleQueue();
  }

  public getNumberOfQuestions(): number {
    return this.numberOfQuestions;
  }

  public getNumberOfQuestionsLeft(): number {
    return this.randomVocabularyIterator.getQueueSize();
  }

  private makeQuestion(
    vocabulary: ObservableVocabulary,
  ): ObservableWritingQuestion {
    const definition = assertExists(
      _.sample(vocabulary.definitions.slice()),
      'definition should not be null or undefined',
    );

    return {
      questionId: uuid.v4(),
      testingVocabulary: vocabulary,
      givenDefinition: definition,
    };
  }
}
