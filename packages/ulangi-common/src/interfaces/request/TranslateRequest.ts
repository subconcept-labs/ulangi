/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface TranslateRequest extends Request {
  readonly path: '/translate';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    readonly sourceText: string;
    readonly sourceLanguageCode: string;
    readonly translatedToLanguageCode: string;
    readonly translator: string;
  };
  readonly body: null;
}
