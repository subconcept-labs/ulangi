/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

export class ModSequenceStrategy {
  public getLevelsByTermPosition(
    termPosition: number,
    maxLevel: number
  ): number[] {
    if (termPosition < 0) {
      throw new Error('termPosition should be equal or greater than 0');
    }

    let list = [];
    let i: number;

    if (termPosition !== 0) {
      for (i = maxLevel - 1; i >= 0; --i) {
        if (termPosition % i === 0) {
          list.push(i);
        }
      }
    } else {
      list.push(0);
    }

    // Add all other levels to the list if it does not exist
    for (i = 0; i < maxLevel; ++i) {
      if (!_.includes(list, i)) {
        list.push(i);
      }
    }

    return list;
  }
}
