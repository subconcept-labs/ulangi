/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as moment from 'moment';

import { changeToShortFormLocale } from './changeToShortFormLocale';

describe('changeToShortFormLocale', (): void => {
  it('change locale should mutate global locale', (): void => {
    expect(moment().locale()).toEqual('en');
    changeToShortFormLocale();
    expect(moment().locale()).toEqual('en-short');
  });
});
