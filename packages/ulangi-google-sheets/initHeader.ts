/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getHeaderRange } from "./getHeaderRange"
import { getColumnNames } from "./getColumnNames"

export function initHeader(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  const headerRange = getHeaderRange(sheet)

  headerRange
    .setValues([ getColumnNames().slice() ])
    .setBackground("#d9ead3")
}
