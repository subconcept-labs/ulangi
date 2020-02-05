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

export class VocabularyIterator<T extends Vocabulary = Vocabulary> {
  private vocabularyList: OrderedMap<string, T>;
  private currentIndex: number = 0;

  public constructor(vocabularyList?: Map<string, T> | OrderedMap<string, T>) {
    this.vocabularyList = OrderedMap(vocabularyList || []);
  }

  public next(): T {
    this.currentIndex += 1;
    return this.current();
  }

  public previous(): T {
    this.currentIndex -= 1;
    return this.current();
  }

  public current(): T {
    return assertExists(
      this.vocabularyList.valueSeq().get(this.currentIndex || 0),
      'index out of bound',
    );
  }

  public reset(): void {
    this.currentIndex = 0;
  }

  public isDone(): boolean {
    return this.currentIndex === this.vocabularyList.size - 1;
  }

  public getSize(): number {
    return this.vocabularyList.size;
  }

  public getRemainingSize(): number {
    return this.vocabularyList.size - this.currentIndex - 1;
  }

  public update(key: string, value: T): void {
    this.vocabularyList = this.vocabularyList.set(key, value);
  }

  public merge(vocabularyList: Map<string, T> | OrderedMap<string, T>): void {
    this.vocabularyList = this.vocabularyList.merge(vocabularyList);
  }

  public shuffle(): void {
    this.vocabularyList = shuffleImmutableMap(this.vocabularyList);
  }
}
