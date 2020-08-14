/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { ReviewPriority } from '@ulangi/ulangi-common/enums';
import * as _ from 'lodash';

export class LevelSequenceStrategy {
  private readonly DUE_TERMS_FIRST: number[][] = [
    [9, 1, 2, 3, 4, 5, 6, 7, 8, 0],
    [8, 9, 1, 2, 3, 4, 5, 6, 7, 0],
    [7, 8, 9, 1, 2, 3, 4, 5, 6, 0],
    [6, 7, 8, 9, 1, 2, 3, 4, 5, 0],
    [5, 6, 7, 8, 9, 1, 2, 3, 4, 0],
    [4, 5, 6, 7, 8, 9, 1, 2, 3, 0],
    [3, 4, 5, 6, 7, 8, 9, 1, 2, 0],
    [2, 3, 4, 5, 6, 7, 8, 9, 1, 0],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  ];

  private readonly NEW_TERMS_FIRST: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [0, 2, 3, 4, 5, 6, 7, 8, 9, 1],
    [0, 3, 4, 5, 6, 7, 8, 9, 1, 2],
    [0, 4, 5, 6, 7, 8, 9, 1, 2, 3],
    [0, 5, 6, 7, 8, 9, 1, 2, 3, 4],
    [0, 6, 7, 8, 9, 1, 2, 3, 4, 5],
    [0, 7, 8, 9, 1, 2, 3, 4, 5, 6],
    [0, 8, 9, 1, 2, 3, 4, 6, 7, 8],
    [0, 9, 1, 2, 3, 4, 5, 6, 7, 8],
  ];

  private readonly NO_PRIORITY: number[][] = _.concat(
    this.DUE_TERMS_FIRST,
    this.NEW_TERMS_FIRST
  );

  public getLevelSequence(priority: ReviewPriority): number[] {
    let sequence;
    switch (priority) {
      case ReviewPriority.DUE_TERMS_FIRST:
        sequence = _.sample(this.DUE_TERMS_FIRST);

      case ReviewPriority.NEW_TERMS_FIRST:
        sequence = _.sample(this.NEW_TERMS_FIRST);

      default:
        sequence = _.sample(this.NO_PRIORITY);
    }

    return assertExists(sequence);
  }
}
