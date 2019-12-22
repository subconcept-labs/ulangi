/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export interface DefinitionExtraFields {
  readonly wordClass: readonly string[][];
  readonly image: readonly string[][];
  readonly synonym: readonly string[][];
  readonly antonym: readonly string[][];
  readonly example: readonly string[][];
  readonly note: readonly string[][];
}
