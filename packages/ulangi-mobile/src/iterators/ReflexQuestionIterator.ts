/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import {
  DefinitionExtraFieldParser,
  VocabularyExtraFieldParser,
} from '@ulangi/ulangi-common/core';
import { Definition, Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { ObservableReflexQuestion } from '@ulangi/ulangi-observable';
import * as _ from 'lodash';

import { DefinitionPool } from '../pools/DefinitionPool';
import { RandomVocabularyIterator } from './RandomVocabularyIterator';

export class ReflexQuestionIterator {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();
  private definitionExtraFieldParser = new DefinitionExtraFieldParser();
  private definitionPool = new DefinitionPool();

  private randomVocabularyIterator: RandomVocabularyIterator;
  private currentQuestion?: ObservableReflexQuestion;

  public constructor(vocabularyList?: Map<string, Vocabulary>) {
    this.randomVocabularyIterator = new RandomVocabularyIterator(
      vocabularyList,
    );

    this.definitionPool = new DefinitionPool(
      new Map(
        typeof vocabularyList !== 'undefined'
          ? _.flatMap(
              Array.from(vocabularyList.values()),
              (vocabulary): [string, Definition][] => {
                return vocabulary.definitions.map(
                  (definition): [string, Definition] => {
                    return [definition.definitionId, definition];
                  },
                );
              },
            )
          : [],
      ),
    );
  }

  public next(): ObservableReflexQuestion {
    const nextVocabulary = this.randomVocabularyIterator.next();
    this.currentQuestion = this.makeQuestion(nextVocabulary);
    return this.currentQuestion;
  }

  public current(): ObservableReflexQuestion {
    return assertExists(this.currentQuestion);
  }

  public merge(vocabularyList: Map<string, Vocabulary>): void {
    this.randomVocabularyIterator.merge(vocabularyList);
    this.definitionPool.merge(
      new Map(
        typeof vocabularyList !== 'undefined'
          ? _.flatMap(
              Array.from(vocabularyList.values()),
              (vocabulary): [string, Definition][] => {
                return vocabulary.definitions.map(
                  (definition): [string, Definition] => {
                    return [definition.definitionId, definition];
                  },
                );
              },
            )
          : [],
      ),
    );
  }

  public isDone(): boolean {
    return this.randomVocabularyIterator.isDone();
  }

  public getNumberOfQuestionLeft(): number {
    return this.randomVocabularyIterator.getQueueSize();
  }

  public shuffleQueue(): void {
    this.randomVocabularyIterator.shuffleQueue();
  }

  public reset(): void {
    this.randomVocabularyIterator = new RandomVocabularyIterator();
    this.currentQuestion = undefined;
  }

  private makeQuestion(vocabulary: Vocabulary): ObservableReflexQuestion {
    const correctDefinition = assertExists(
      _.sample(vocabulary.definitions.slice()),
      'definition should not be null or undefined',
    );

    const correctMeaning = this.definitionExtraFieldParser.parse(
      correctDefinition.meaning,
    ).plainMeaning;

    // Get a random definition
    const exceptIds = vocabulary.definitions.map(
      (definition): string => definition.definitionId,
    );
    const randomDefinition = assertExists(
      _.first(
        this.definitionPool.getRandomDefinitionsFromPool(1, false, exceptIds),
      ),
      'definition should not be null or undefined',
    );

    const randomMeaning = this.definitionExtraFieldParser.parse(
      randomDefinition.meaning,
    ).plainMeaning;

    return new ObservableReflexQuestion(
      this.vocabularyExtraFieldParser.parse(
        vocabulary.vocabularyText,
      ).vocabularyTerm,
      _.random(0, 1) === 1 ? correctMeaning : randomMeaning,
      correctMeaning,
    );
  }
}
