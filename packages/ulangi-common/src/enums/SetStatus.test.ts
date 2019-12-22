/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { SetStatus } from '../../src/enums/SetStatus';

describe('enums/SetStatus', function(): void {
  it('print all values correctly', function(): void {
    expect(_.values(SetStatus)).toEqual(['ACTIVE', 'ARCHIVED', 'DELETED']);
  });
});
