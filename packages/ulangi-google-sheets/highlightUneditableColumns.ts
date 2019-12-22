/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnPositionByName } from "./getColumnPositionByName"
import { getOriginalColumnNames } from "./getOriginalColumnNames"
import { getUneditableColumnNames } from "./getUneditableColumnNames"
import { convertColumnPositionToLetter } from "./convertColumnPositionToLetter"

export function highlightUneditableColumns(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {

  getUneditableColumnNames().forEach((name): void => {
    const letter = convertColumnPositionToLetter(getColumnPositionByName(name))

    sheet.getRange(`${letter}:${letter}`).setBackground("#b7b7b7")
  })
}
