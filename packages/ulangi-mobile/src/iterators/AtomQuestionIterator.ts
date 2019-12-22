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
import { pickRandomFromImmutableMap } from '@ulangi/ulangi-common/utils';
import { ObservableAtomQuestion } from '@ulangi/ulangi-observable';
import * as changeCase from 'change-case';
import { OrderedMap } from 'immutable';
import * as _ from 'lodash';
import { observable } from 'mobx';

import { config } from '../constants/config';
import { VocabularyPool } from '../pools/VocabularyPool';
import { RandomVocabularyIterator } from './RandomVocabularyIterator';

export class AtomQuestionIterator {
  private vocabularyExtraFieldParser = new VocabularyExtraFieldParser();
  private definitionExtraFieldParser = new DefinitionExtraFieldParser();
  private vocabularyPool = new VocabularyPool();

  private randomVocabularyIterator: RandomVocabularyIterator;
  private currentQuestion?: ObservableAtomQuestion;

  public constructor(vocabularyList?: Map<string, Vocabulary>) {
    this.randomVocabularyIterator = new RandomVocabularyIterator(
      vocabularyList
    );

    this.vocabularyPool = new VocabularyPool(vocabularyList);
  }

  public next(): ObservableAtomQuestion {
    const vocabulary = this.randomVocabularyIterator.next();
    this.currentQuestion = this.makeQuestion(vocabulary);
    console.log(this.currentQuestion);
    return this.currentQuestion;
  }

  public current(): ObservableAtomQuestion {
    return assertExists(this.currentQuestion);
  }

  public isDone(): boolean {
    return this.randomVocabularyIterator.isDone();
  }

  public getNumberOfQuestionLeft(): number {
    return this.randomVocabularyIterator.getQueueSize();
  }

  public merge(vocabularyList: Map<string, Vocabulary>): void {
    this.randomVocabularyIterator.merge(vocabularyList);
    this.vocabularyPool.merge(vocabularyList);
  }

  public shuffleQueue(): void {
    this.randomVocabularyIterator.shuffleQueue();
  }

  private makeQuestion(vocabulary: Vocabulary): ObservableAtomQuestion {
    const vocabularyTerm = this.vocabularyExtraFieldParser.parse(
      vocabulary.vocabularyText
    ).vocabularyTerm;

    let answer = changeCase.upper(this.getRandomWord(vocabularyTerm));
    if (answer.length > config.atom.maxCharacters) {
      const startIndex = _.random(0, answer.length - config.atom.maxCharacters);
      answer = answer.substring(
        startIndex,
        startIndex + config.atom.maxCharacters
      );
    }

    const definitionList = OrderedMap(
      vocabulary.definitions.map(
        (definition): [string, Definition] => [
          definition.definitionId,
          definition,
        ]
      )
    );

    const [, definition] = pickRandomFromImmutableMap(definitionList);
    return new ObservableAtomQuestion(
      this.replaceTextWithUnderscores(changeCase.upper(vocabularyTerm), answer),
      changeCase.upper(answer),
      this.definitionExtraFieldParser.parse(definition.meaning).plainMeaning,
      observable.array(this.generateCharacterPool(answer))
    );
  }

  private replaceTextWithUnderscores(text: string, pattern: string): string {
    // Replace all _ with \_
    const regex = /_/g;
    const escapedText = text.replace(regex, '_');
    const underscores = _.fill(Array(pattern.length), '_').join('');
    // First underscores with first occurrence only
    return escapedText.replace(pattern, underscores);
  }

  private generateCharacterPool(text: string): string[] {
    const pool: string[] = text.split('');

    // If not enough characters, then take characters from another vocabulary
    while (pool.length < config.atom.minCharacters) {
      const vocabulary = assertExists(
        _.first(this.vocabularyPool.getRandomVocabularyFromPool(1, false)),
        'vocabulary should not be null or undefined'
      );

      const vocabularyTerm = changeCase.upper(
        this.vocabularyExtraFieldParser.parse(vocabulary.vocabularyText)
          .vocabularyTerm
      );
      const randomWord = this.getRandomWord(vocabularyTerm);
      const randomCharacter = randomWord[_.random(0, randomWord.length - 1)];

      pool.push(randomCharacter);
    }

    return _.shuffle(pool);
  }

  private getRandomWord(text: string): string {
    const words = _.words(text);
    return words[_.random(0, words.length - 1)];
  }
}
