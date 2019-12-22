/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';

import { User } from '../general/User';
import { Request } from './Request';

export interface UploadUserRequest extends Request {
  readonly path: '/upload-user';
  readonly method: 'post';
  readonly authRequired: true;
  readonly query: null;
  readonly body: {
    readonly user: DeepPartial<User>;
  };
}
