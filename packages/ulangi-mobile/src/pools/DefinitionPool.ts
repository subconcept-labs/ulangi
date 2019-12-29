/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Definition } from '@ulangi/ulangi-common/interfaces';
import { pickRandomFromImmutableMap } from '@ulangi/ulangi-common/utils';
import { OrderedMap } from 'immutable';

export class DefinitionPool<D extends Definition = Definition> {
  private definitionPool: OrderedMap<string, D>;

  public constructor(definitions?: Map<string, D> | OrderedMap<string, D>) {
    this.definitionPool = OrderedMap(definitions || []);
  }

  public getPoolSize(): number {
    return this.definitionPool.size;
  }

  public merge(definitions: Map<string, D> | OrderedMap<string, D>): void {
    this.definitionPool = OrderedMap(definitions || []);
  }

  public getRandomDefinitionsFromPool(
    limit: number,
    unique: boolean,
    except?: readonly string[],
  ): readonly D[] {
    let picked: D[] = [];

    let definitionPool = this.definitionPool;

    // Remove those listed in except
    if (typeof except !== 'undefined') {
      except.forEach(
        (definitionId): void => {
          definitionPool = definitionPool.remove(definitionId);
        },
      );
    }

    while (picked.length < limit && !definitionPool.isEmpty()) {
      const [definitionId, definition] = pickRandomFromImmutableMap(
        definitionPool,
      );
      if (unique === true) {
        // Remove it from pool, so we won't pick it again
        definitionPool = definitionPool.remove(definitionId);
      }

      picked.push(definition);
    }

    return picked;
  }
}
