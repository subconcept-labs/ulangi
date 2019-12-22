/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface GetRemoteConfigRequest extends Request {
  readonly path: '/get-remote-config';
  readonly method: 'get';
  readonly authRequired: false;
  readonly query: null;
  readonly body: null;
}
