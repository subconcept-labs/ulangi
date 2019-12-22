/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface TranslateBidirectionRequest extends Request {
  readonly path: '/translate-bidirection';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    sourceText: string;
    languageCodePair: string;
  };
  readonly body: null;
}
