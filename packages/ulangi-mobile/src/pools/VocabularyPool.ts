/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Vocabulary } from '@ulangi/ulangi-common/interfaces';
import { pickRandomFromImmutableMap } from '@ulangi/ulangi-common/utils';
import { OrderedMap } from 'immutable';

export class VocabularyPool<V extends Vocabulary = Vocabulary> {
  private vocabularyPool: OrderedMap<string, V>;

  public constructor(vocabularyList?: Map<string, V> | OrderedMap<string, V>) {
    this.vocabularyPool = OrderedMap(vocabularyList || []);
  }

  public getPoolSize(): number {
    return this.vocabularyPool.size;
  }

  public merge(vocabularyList: Map<string, V> | OrderedMap<string, V>): void {
    this.vocabularyPool = this.vocabularyPool.merge(vocabularyList);
  }

  public getRandomVocabularyFromPool(
    limit: number,
    unique: boolean,
    except?: readonly string[],
  ): readonly V[] {
    let picked: V[] = [];

    let vocabularyPool = this.vocabularyPool;

    // Remove those listed in except
    if (typeof except !== 'undefined') {
      except.forEach(
        (vocabularyId): void => {
          vocabularyPool = vocabularyPool.remove(vocabularyId);
        },
      );
    }

    while (picked.length < limit && !vocabularyPool.isEmpty()) {
      const [vocabularyId, vocabulary] = pickRandomFromImmutableMap(
        vocabularyPool,
      );
      if (unique === true) {
        // Remove it remove pool, so we won't pick it again
        vocabularyPool = vocabularyPool.remove(vocabularyId);
      }

      picked.push(vocabulary);
    }

    return picked;
  }
}
