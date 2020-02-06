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

import { VocabularyIterator } from './VocabularyIterator';

export class WritingQuestionIterator {
  private numberOfQuestions: number;

  private vocabularyIterator: VocabularyIterator<ObservableVocabulary>;

  public constructor(vocabularyList?: Map<string, ObservableVocabulary>) {
    this.vocabularyIterator = new VocabularyIterator(
      vocabularyList ? OrderedMap(vocabularyList) : undefined,
    );

    this.numberOfQuestions = this.vocabularyIterator.getSize();
  }

  public update(key: string, value: ObservableVocabulary): void {
    this.vocabularyIterator.update(key, value);
  }

  public current(): ObservableWritingQuestion {
    return this.makeQuestion(this.vocabularyIterator.current());
  }

  public previous(): ObservableWritingQuestion {
    const previousVocabulary = this.vocabularyIterator.previous();
    return this.makeQuestion(previousVocabulary);
  }

  public next(): ObservableWritingQuestion {
    const nextVocabulary = this.vocabularyIterator.next();
    return this.makeQuestion(nextVocabulary);
  }

  public isDone(): boolean {
    return this.vocabularyIterator.isDone();
  }

  public getNumberOfQuestions(): number {
    return this.numberOfQuestions;
  }

  public getNumberOfQuestionsLeft(): number {
    return this.vocabularyIterator.getRemainingSize();
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
