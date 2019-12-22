/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface DownloadSpecificSetsRequest extends Request {
  readonly path: '/download-specific-sets';
  readonly method: 'post';
  readonly authRequired: true;
  readonly query: null;
  readonly body: {
    readonly setIds: readonly string[];
  };
}
