/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnNames } from "./getColumnNames"
import { getSetIdForSyncing } from "./getSetIdForSyncing"
import { getColumnPositionByName } from "./getColumnPositionByName"
import { getCurrentValueByColumnName } from "./getCurrentValueByColumnName"
import { convertColumnPositionToLetter } from "./convertColumnPositionToLetter"
import { areDefinitionsTheSame } from "./areDefinitionsTheSame"
import { Vocabulary } from "@ulangi/ulangi-common/interfaces"
import { DeepPartial } from "@ulangi/extended-types"
import { convertVocabularyListToRows } from "./convertVocabularyListToRows"

export function updateRows(sheet: GoogleAppsScript.Spreadsheet.Sheet, vocabularySetIdPairs: [ DeepPartial<Vocabulary>, undefined | string ][]) {
  const columnNames = getColumnNames()

  const rowIndexValuesPairs = convertVocabularyListToRows(
    vocabularySetIdPairs,
    sheet
  )

  let lastRow = sheet.getLastRow()
  rowIndexValuesPairs.forEach(([ rowIndex, values ]): void => {
    if (typeof rowIndex === "undefined") {
      ++lastRow
    }

    const targetRowIndex = typeof rowIndex !== "undefined"
      ? rowIndex
      : lastRow

    values[values.length - 1] = `=ISEDITED(A${targetRowIndex}:${convertColumnPositionToLetter(columnNames.length - 1)}${targetRowIndex})` 

    sheet.getRange(targetRowIndex, 1, 1, columnNames.length).setValues([ values ])
  })
}
