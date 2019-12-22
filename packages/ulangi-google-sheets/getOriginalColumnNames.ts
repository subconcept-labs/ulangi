/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnNames } from "./getColumnNames"

export function getOriginalColumnNames(): readonly string[] {
  return getColumnNames().filter((column): boolean => {
    return column.lastIndexOf("original", 0) === 0
  })
}
