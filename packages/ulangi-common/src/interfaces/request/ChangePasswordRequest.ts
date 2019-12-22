/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface ChangePasswordRequest extends Request {
  readonly path: '/change-password';
  readonly method: 'post';
  readonly authRequired: true;
  readonly query: null;
  readonly body: {
    readonly currentPassword: string;
    readonly newPassword: string;
  };
}
