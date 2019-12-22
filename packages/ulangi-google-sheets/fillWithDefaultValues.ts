/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getDefaultValues } from "./getDefaultValues"
import { getColumnNameByPosition } from "./getColumnNameByPosition"

export function fillWithDefaultValues(values: any[]): any[]{
  const defaultValues = getDefaultValues()
  return values.map((value, index) => {
    if (value === ""){
      return defaultValues[getColumnNameByPosition(index + 1)]
    }
    else {
      return value
    }
  })
}
