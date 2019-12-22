/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { getColumnLetterByName } from "./getColumnLetterByName"
import { getColumnPositionByName } from "./getColumnPositionByName"
import { convertColumnPositionToLetter } from "./convertColumnPositionToLetter"

export function createHighlightEditedCellsRule(): GoogleAppsScript.Spreadsheet.ConditionalFormatRule {
  const sheet = getSheetForSyncing()

  if (sheet !== null){
    const firstEditableColumnLetter = convertColumnPositionToLetter(getColumnPositionByName("vocabularyText"))
    const lastEditableColumnLetter = convertColumnPositionToLetter(getColumnPositionByName("setId"))
    const firstOriginalColumnLetter = convertColumnPositionToLetter(getColumnPositionByName("originalVocabularyText"))

    const criteriaValue = `=not(exact(${firstEditableColumnLetter}2, ${firstOriginalColumnLetter}2))`

    const range = sheet.getRange(`${firstEditableColumnLetter}2:${lastEditableColumnLetter}`);

    return SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(criteriaValue)
      .setBackground("#FFF2CC")
      .setRanges([range])
      .build();
  }
  else {
    throw new Error("Document has not yet set up for syncing.")
  }
}
