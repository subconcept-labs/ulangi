/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

import { timeFromNow } from '../utils/timeFromNow';

describe('timeFromNow', (): void => {
  describe('short form, without suffix', (): void => {
    const shortForm = true;
    const withoutSuffix = true;
    it('return now if time is current or in the pass', (): void => {
      expect(
        timeFromNow(
          moment()
            .subtract(1, 'second')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('now');
      expect(
        timeFromNow(
          moment()
            .add(1, 'second')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('now');
      expect(timeFromNow(moment().toDate(), shortForm, withoutSuffix)).toEqual(
        'now'
      );
    });

    it('calculate minutes correctly', (): void => {
      expect(
        timeFromNow(
          moment()
            .add(59, 'seconds')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1m');
      expect(
        timeFromNow(
          moment()
            .add(60, 'seconds')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1m');
      expect(
        timeFromNow(
          moment()
            .add(61, 'seconds')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1m');
      expect(
        timeFromNow(
          moment()
            .add(1, 'minute')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1m');
      expect(
        timeFromNow(
          moment()
            .add(2, 'minutes')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('2m');
    });

    it('calculate hours correctly', (): void => {
      expect(
        timeFromNow(
          moment()
            .add(59, 'minutes')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1h');
      expect(
        timeFromNow(
          moment()
            .add(60, 'minutes')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1h');
      expect(
        timeFromNow(
          moment()
            .add(61, 'minutes')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1h');
      expect(
        timeFromNow(
          moment()
            .add(1, 'hour')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1h');
      expect(
        timeFromNow(
          moment()
            .add(2, 'hours')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('2h');
    });

    it('calculate days correctly', (): void => {
      expect(
        timeFromNow(
          moment()
            .add(23, 'hours')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1d');
      expect(
        timeFromNow(
          moment()
            .add(24, 'hours')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1d');
      expect(
        timeFromNow(
          moment()
            .add(25, 'hours')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1d');
      expect(
        timeFromNow(
          moment()
            .add(1, 'day')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1d');
      expect(
        timeFromNow(
          moment()
            .add(2, 'days')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('2d');
    });

    it('calculate months correctly', (): void => {
      expect(
        timeFromNow(
          moment()
            .add(29, 'days')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1mo');
      expect(
        timeFromNow(
          moment()
            .add(30, 'days')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1mo');
      expect(
        timeFromNow(
          moment()
            .add(31, 'days')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1mo');
      expect(
        timeFromNow(
          moment()
            .add(1, 'month')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1mo');
      expect(
        timeFromNow(
          moment()
            .add(2, 'months')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('2mo');
    });

    it('calculate years correctly', (): void => {
      expect(
        timeFromNow(
          moment()
            .add(11, 'months')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1y');
      expect(
        timeFromNow(
          moment()
            .add(12, 'months')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1y');
      expect(
        timeFromNow(
          moment()
            .add(13, 'months')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1y');
      expect(
        timeFromNow(
          moment()
            .add(1, 'year')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('1y');
      expect(
        timeFromNow(
          moment()
            .add(2, 'years')
            .toDate(),
          shortForm,
          withoutSuffix
        )
      ).toEqual('2y');
    });
  });
});
