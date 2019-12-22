/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnNames } from "./getColumnNames"
import { getColumnPositionByName } from "./getColumnPositionByName"

export function getCurrentValueByColumnName(values: readonly any[]): {[P in string]: any} {

  const result: { [P in string]: any } = {}

  getColumnNames().forEach((name): void => {
    result[name] = values[getColumnPositionByName(name) - 1]
  })

  return result
}
