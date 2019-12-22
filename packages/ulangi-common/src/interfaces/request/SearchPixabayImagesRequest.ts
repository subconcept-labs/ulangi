/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Request } from './Request';

export interface SearchPixabayImagesRequest extends Request {
  readonly path: '/search-pixabay-images';
  readonly method: 'get';
  readonly authRequired: true;
  readonly query: {
    readonly q: string;
    // eslint-disable-next-line @typescript-eslint/camelcase
    readonly image_type: string;
    readonly page: number;
    readonly safesearch: boolean;
  };
  readonly body: null;
}
