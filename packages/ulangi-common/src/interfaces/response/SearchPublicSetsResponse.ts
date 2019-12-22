/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { PublicSet } from '../general/PublicSet';

export interface SearchPublicSetsResponse {
  readonly setList: readonly PublicSet[];
  readonly nextOffset: number | null;
}
