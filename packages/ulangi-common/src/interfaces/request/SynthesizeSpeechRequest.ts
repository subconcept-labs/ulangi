/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface SynthesizeSpeechRequest extends Request {
  readonly path: '/synthesize-speech';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    readonly text: string;
    readonly languageCode: string;
  };
  readonly body: null;
}
