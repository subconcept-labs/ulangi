/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnLetterByName } from "./getColumnLetterByName"
import { getColumnPositionByName } from "./getColumnPositionByName"
import { getColumnNames } from "./getColumnNames"

export function getEditedRows(fromRowIndex: number, toRowIndex: number, limit: number, sheet: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Range[] {
  const editedColumnLetter = getColumnLetterByName("edited")
  const editedColumn = sheet.getRange(fromRowIndex, getColumnPositionByName("edited"), toRowIndex)

  const textFinder = editedColumn
    .createTextFinder("^YES|NEW$")
    .useRegularExpression(true)

  const matches = textFinder.findAll().splice(0, limit)

  const rows = matches.map((match) => {
    return sheet.getRange(
      match.getRowIndex(),
      1,
      1,
      getColumnNames().length
    )
  })

  return rows
}
