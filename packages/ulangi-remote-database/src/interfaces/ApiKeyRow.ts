/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { ApiScope } from '@ulangi/ulangi-common/enums';

export interface ApiKeyRow {
  readonly apiKey: string;
  readonly apiScope: ApiScope;
  readonly userId: string;
  readonly expiredAt: null | Date;
}
