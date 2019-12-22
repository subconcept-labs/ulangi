/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnNames } from "./getColumnNames"

export function getHeaderRange(sheet: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Range {
  return sheet.getRange(1, 1, 1, getColumnNames().length)
}
