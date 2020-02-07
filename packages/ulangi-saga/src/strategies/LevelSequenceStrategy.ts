/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import * as _ from 'lodash';

export class LevelSequenceStrategy {
  private readonly PRIORITIZE_LEARNED_TERMS: number[][] = [
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    [7, 6, 5, 4, 3, 2, 1, 8, 9, 0],
    [5, 4, 3, 2, 1, 6, 7, 8, 9, 0],
    [3, 2, 1, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  ];

  private readonly PRIORITIZE_NEW_TERMS: number[][] = [
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [0, 7, 6, 5, 4, 3, 2, 1, 8, 9],
    [0, 5, 4, 3, 2, 1, 6, 7, 8, 9],
    [0, 3, 2, 1, 4, 5, 6, 7, 8, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];

  private readonly FIFTY_FIFTY: number[][] = [
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    [7, 6, 5, 4, 3, 2, 1, 8, 9, 0],
    [5, 4, 3, 2, 1, 6, 7, 8, 9, 0],
    [3, 2, 1, 4, 5, 6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [0, 7, 6, 5, 4, 3, 2, 1, 8, 9],
    [0, 5, 4, 3, 2, 1, 6, 7, 8, 9],
    [0, 3, 2, 1, 4, 5, 6, 7, 8, 9],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];

  public getLevelSequence(
    strategy:
      | 'PRIORITIZE_LEARNED_TERMS'
      | 'PRIORITIZE_NEW_TERMS'
      | 'FIFTY_FIFTY'
  ): number[] {
    let sequence;
    switch (strategy) {
      case 'PRIORITIZE_LEARNED_TERMS':
        sequence = _.sample(this.PRIORITIZE_LEARNED_TERMS);

      case 'PRIORITIZE_NEW_TERMS':
        sequence = _.sample(this.PRIORITIZE_NEW_TERMS);

      default:
        sequence = _.sample(this.FIFTY_FIFTY);
    }

    return assertExists(sequence);
  }
}
