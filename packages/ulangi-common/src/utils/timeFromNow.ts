/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

import { backupLocale } from './backupLocale';
import { changeToShortFormLocale } from './changeToShortFormLocale';

export function timeFromNow(
  date: Date,
  shortForm?: boolean,
  withoutSuffix?: boolean
): string {
  if (shortForm === true) {
    const revertLocale = backupLocale();
    changeToShortFormLocale();
    const time = moment(date).fromNow(withoutSuffix);
    revertLocale();
    return time;
  } else {
    return moment(date).fromNow(withoutSuffix);
  }
}
