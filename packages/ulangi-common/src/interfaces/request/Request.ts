/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Request {
  readonly path: string;
  readonly method: 'get' | 'post';
  readonly authRequired: boolean;
  readonly query: null | object;
  readonly body: null | object;
}
