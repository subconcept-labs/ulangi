/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { shuffleImmutableMap } from '@ulangi/ulangi-common/utils';
import { OrderedMap } from 'immutable';

export class RandomVocabularyIterator<V extends Vocabulary = Vocabulary> {
  private vocabularyQueue: OrderedMap<string, V>;
  private currentVocabulary?: V;

  public constructor(vocabularyList?: Map<string, V> | OrderedMap<string, V>) {
    this.vocabularyQueue = OrderedMap(vocabularyList || []);
  }

  public next(): V {
    this.currentVocabulary = assertExists(
      this.vocabularyQueue.first(),
      'nextVocabulary should not be null or undefined',
    );

    // Remove the first one
    this.vocabularyQueue = this.vocabularyQueue.rest();

    return this.currentVocabulary;
  }

  public current(): V {
    return assertExists(
      this.currentVocabulary,
      'currentVocabulary should not be null or undefined',
    );
  }

  public isDone(): boolean {
    return this.vocabularyQueue.isEmpty();
  }

  public getQueueSize(): number {
    return this.vocabularyQueue.size;
  }

  public merge(vocabularyList: Map<string, V> | OrderedMap<string, V>): void {
    this.vocabularyQueue = this.vocabularyQueue.merge(vocabularyList);
  }

  public shuffleQueue(): void {
    this.vocabularyQueue = shuffleImmutableMap(this.vocabularyQueue);
  }
}
