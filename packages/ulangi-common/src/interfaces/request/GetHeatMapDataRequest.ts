/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface GetHeatMapDataRequest extends Request {
  readonly path: '/get-heat-map-data';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    startDate: Date;
    endDate: Date;
  };
  readonly body: null;
}
