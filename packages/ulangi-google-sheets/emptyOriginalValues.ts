/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnNameByPosition } from "./getColumnNameByPosition"

export function emptyOriginalValues(values: any[]): any[] {
  return values.map((value, index): any => {
    if (getColumnNameByPosition(index + 1).lastIndexOf("original", 0) === 0){
      return ""
    }
    else {
      return value
    }
  })
}
