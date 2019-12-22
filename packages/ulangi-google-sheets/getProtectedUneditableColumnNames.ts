/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { getColumnNameByPosition } from "./getColumnNameByPosition"
import { getUneditableColumnNames  } from "./getUneditableColumnNames"

export function getProtectedUneditableColumnNames(_sheet?: GoogleAppsScript.Spreadsheet.Sheet): string[] {

  const sheet = (typeof _sheet !== "undefined")
    ? _sheet
    : getSheetForSyncing()

  if (sheet !== null){
    const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);

    const currentProtectedColumnNames: string[] = []

    protections
      .filter((protection): boolean => {
        return protection.getDescription() === "Protected uneditable column" && protection.isWarningOnly()
      })
      .forEach((protection): void => {
        const fromIndex = protection.getRange().getColumn()
        const toIndex = protection.getRange().getNumColumns() - 1 + fromIndex

        for (let i = fromIndex; i <= toIndex; i++){
          currentProtectedColumnNames.push(
            getColumnNameByPosition(i)
          )
        }
      })

    return getUneditableColumnNames().filter((name): boolean => {
      return currentProtectedColumnNames.indexOf(name) !== -1
    })
  }
  else {
    throw new Error("Document has not yet set up for syncing.")
  }
}
