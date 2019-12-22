/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

export class ObservableStore {
  protected noReset: string[] = [];

  public reset(newStore: ObservableStore): void {
    _.forOwn(
      newStore,
      (value, key): void => {
        if (_.has(this, key) && !_.includes(this.noReset, key)) {
          this[key as keyof ObservableStore] = value;
        }
      }
    );
  }
}
