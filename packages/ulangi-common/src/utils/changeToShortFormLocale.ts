/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import * as moment from 'moment';

export function changeToShortFormLocale(): void {
  if (_.includes(moment.locales(), 'en-short')) {
    moment.locale('en-short');
  } else {
    moment.defineLocale('en-short', {
      parentLocale: 'en',
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: function(_, withoutSuffix): string {
          return withoutSuffix ? 'now' : 'a few seconds';
        },
        ss: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1mo',
        MM: '%dmo',
        y: '1y',
        yy: '%dy',
      },
    });
  }
}
