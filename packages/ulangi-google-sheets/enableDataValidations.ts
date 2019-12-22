/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { createDataValidationRules } from "./createDataValidationRules"
import { getSheetForSyncing } from "./getSheetForSyncing"
import { getColumnLetterByName } from "./getColumnLetterByName"

export function enableDataValidations(_sheet: GoogleAppsScript.Spreadsheet.Sheet): void {

  const sheet = (typeof _sheet !== "undefined") ? _sheet: getSheetForSyncing()

  if (sheet !== null){
    const columnsToAddValidation = ["vocabularyText", "vocabularyStatus", "definitions", "category", "spacedRepetitionLevel", "writingLevel", "disableWriting"]

    const rules = createDataValidationRules()

    columnsToAddValidation.forEach((name): void => {
      sheet
        .getRange(
          `${getColumnLetterByName(name)}2:${getColumnLetterByName(name)}`
        )
        .clearDataValidations()
        .setDataValidation(rules[name])
    })
  }
  else {
    throw new Error("Document is not yet set up for syncing.")
  }

}
