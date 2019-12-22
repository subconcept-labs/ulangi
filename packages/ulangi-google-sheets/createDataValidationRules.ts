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

export function createDataValidationRules(): {[P in string]: GoogleAppsScript.Spreadsheet.DataValidation } {
  const vocabularyTextColumnLetter = getColumnLetterByName("vocabularyText")
  const definitionsColumnLetter = getColumnLetterByName("definitions")
  const categoryColumnLetter = getColumnLetterByName("category")
  const setIdColumnLetter = getColumnLetterByName("setId")

  return {
    vocabularyText: SpreadsheetApp
      .newDataValidation()
      .requireFormulaSatisfied(`=NOT(ISBLANK(${vocabularyTextColumnLetter}2))`)
      .setHelpText("vocabularyText cannot be empty")
      .setAllowInvalid(true)
      .build(),
    vocabularyStatus: SpreadsheetApp
      .newDataValidation()
      .requireValueInList(["ACTIVE", "ARCHIVED", "DELETED"])
      .setHelpText("vocabularyStatus must be either ACTIVE, ARCHIVED or DELETED")
      .setAllowInvalid(false)
      .build(),
    definitions: SpreadsheetApp
      .newDataValidation()
      .requireFormulaSatisfied(`=NOT(ISBLANK(${definitionsColumnLetter}2))`)
      .setHelpText("definitions cannot be empty")
      .setAllowInvalid(true)
      .build(),
    category: SpreadsheetApp
      .newDataValidation()
      .requireFormulaSatisfied(`=NOT(ISBLANK(${categoryColumnLetter}2))`)
      .setHelpText("category cannot be empty")
      .setAllowInvalid(false)
      .build(),
    spacedRepetitionLevel: SpreadsheetApp
      .newDataValidation()
      .requireNumberBetween(0, 10)
      .setHelpText("spacedRepetitionLevel must be in between 0 and 10")
      .setAllowInvalid(false)
      .build(),
    writingLevel: SpreadsheetApp
      .newDataValidation()
      .requireNumberBetween(0, 10)
      .setHelpText("writingLevel must be in between 0 and 10")
      .setAllowInvalid(false)
      .build(),
    disableWriting: SpreadsheetApp
      .newDataValidation()
      .requireValueInList(["TRUE", "FALSE"])
      .setHelpText("disableWriting must be TRUE or FALSE")
      .setAllowInvalid(false)
      .build(),
    setId: SpreadsheetApp
      .newDataValidation()
      .requireFormulaSatisfied(`=NOT(ISBLANK(${vocabularyTextColumnLetter}2))`)
      .setHelpText("vocabularyText cannot be empty")
      .setAllowInvalid(true)
      .build(),
  } 
}
