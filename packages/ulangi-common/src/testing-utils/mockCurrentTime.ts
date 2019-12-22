/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

// This function return a restore function so that you can use to restore Date.now
export function mockCurrentTime(time?: Date): () => void {
  const date = moment(time)
    .startOf('second')
    .toDate();
  const backup = Date.now;
  Date.now = jest.fn((): number => date.valueOf());

  return (): void => {
    Date.now = backup;
  };
}
