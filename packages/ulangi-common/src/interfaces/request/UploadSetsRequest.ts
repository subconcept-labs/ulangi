/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';

import { Set } from '../general/Set';
import { Request } from './Request';

export interface UploadSetsRequest extends Request {
  readonly path: '/upload-sets';
  readonly method: 'post';
  readonly authRequired: true;
  readonly query: null;
  readonly body: {
    readonly setList: readonly DeepPartial<Set>[];
  };
}
