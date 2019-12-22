/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface Category {
  readonly categoryName: string;
  readonly totalCount: number;
  readonly srLevel0Count: number;
  readonly srLevel1To3Count: number;
  readonly srLevel4To6Count: number;
  readonly srLevel7To8Count: number;
  readonly srLevel9To10Count: number;
  readonly wrLevel0Count: number;
  readonly wrLevel1To3Count: number;
  readonly wrLevel4To6Count: number;
  readonly wrLevel7To8Count: number;
  readonly wrLevel9To10Count: number;
}
