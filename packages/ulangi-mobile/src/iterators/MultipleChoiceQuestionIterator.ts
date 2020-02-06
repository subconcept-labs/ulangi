/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  ObservableDefinition,
  ObservableMultipleChoiceQuestion,
  ObservableVocabulary,
} from '@ulangi/ulangi-observable';
import { OrderedMap } from 'immutable';
import * as _ from 'lodash';
import { observable } from 'mobx';
import * as uuid from 'uuid';

import { DefinitionPool } from '../pools/DefinitionPool';
import { VocabularyIterator } from './VocabularyIterator';

export class MultipleChoiceQuestionIterator {
  private numberOfQuestions: number;

  private vocabularyIterator: VocabularyIterator<ObservableVocabulary>;

  private definitionPool: DefinitionPool<ObservableDefinition>;

  public constructor(vocabularyList?: Map<string, ObservableVocabulary>) {
    this.vocabularyIterator = new VocabularyIterator(
      vocabularyList ? OrderedMap(vocabularyList) : undefined,
    );
    this.definitionPool = new DefinitionPool(
      new Map(
        typeof vocabularyList !== 'undefined'
          ? _.flatMap(
              Array.from(vocabularyList.values()),
              (vocabulary): [string, ObservableDefinition][] => {
                return vocabulary.definitions.map(
                  (definition): [string, ObservableDefinition] => {
                    return [definition.definitionId, definition];
                  },
                );
              },
            )
          : [],
      ),
    );

    this.numberOfQuestions = this.vocabularyIterator.getSize();
    this.vocabularyIterator.shuffle();
  }

  public current(): ObservableMultipleChoiceQuestion {
    return this.makeQuestion(this.vocabularyIterator.current());
  }

  public next(): ObservableMultipleChoiceQuestion {
    const nextVocabulary = this.vocabularyIterator.next();
    return this.makeQuestion(nextVocabulary);
  }

  public isDone(): boolean {
    return this.vocabularyIterator.isDone();
  }

  public shuffleQueue(): void {
    return this.vocabularyIterator.shuffle();
  }

  public getNumberOfQuestions(): number {
    return this.numberOfQuestions;
  }

  public getNumberOfQuestionsLeft(): number {
    return this.vocabularyIterator.getRemainingSize();
  }

  private makeQuestion(
    vocabulary: ObservableVocabulary,
  ): ObservableMultipleChoiceQuestion {
    const correctDefinition = assertExists(
      _.sample(vocabulary.definitions.slice()),
      'correctDefinition should not be null or undefined',
    );

    // Get three random definitions
    const exceptIds = vocabulary.definitions.map(
      (definition): string => definition.definitionId,
    );
    let definitions = this.definitionPool.getRandomDefinitionsFromPool(
      3,
      true,
      exceptIds,
    );

    // Add the correct definition into list of definitions
    definitions = [...definitions, correctDefinition];

    const shuffledDefinitions = _.shuffle(definitions);

    return {
      questionId: uuid.v4(),
      testingVocabulary: vocabulary,
      givenDefinitions: observable.array(shuffledDefinitions),
    };
  }
}
