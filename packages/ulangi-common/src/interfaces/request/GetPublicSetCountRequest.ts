/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface GetPublicSetCountRequest extends Request {
  readonly path: '/get-public-set-count';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    readonly languageCodePair: string;
  };
  readonly body: null;
}
