/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface GetStatisticsRequest extends Request {
  readonly path: '/get-statistics';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    currentLocalTime: Date;
  };
  readonly body: null;
}
