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
  private readonly DUE_TERMS_FIRST: (number | undefined)[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, undefined],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, undefined],
    [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, undefined],
    [3, 4, 5, 6, 7, 8, 9, 0, 1, 2, undefined],
    [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, undefined],
    [5, 6, 7, 8, 9, 0, 1, 2, 3, 4, undefined],
    [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, undefined],
    [7, 8, 9, 0, 1, 2, 3, 4, 5, 6, undefined],
    [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, undefined],
    [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, undefined],
  ];

  private readonly NEW_TERMS_FIRST: (undefined | number)[][] = [
    [undefined, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [undefined, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
    [undefined, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    [undefined, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
    [undefined, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
    [undefined, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
    [undefined, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
    [undefined, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
    [undefined, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8],
  ];

  private readonly NO_PRIORITY: (undefined | number)[][] = _.concat(
    this.DUE_TERMS_FIRST,
    this.NEW_TERMS_FIRST
  );

  public getLevelSequence(priority: ReviewPriority): (undefined | number)[] {
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
