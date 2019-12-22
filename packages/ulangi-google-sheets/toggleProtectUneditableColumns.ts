/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getOriginalColumnNames } from "./getOriginalColumnNames"
import { getColumnPositionByName } from "./getColumnPositionByName"
import { getColumnLetterByName } from "./getColumnLetterByName"
import { getSheetForSyncing } from "./getSheetForSyncing"
import { getUneditableColumnNames } from "./getUneditableColumnNames"
import { getProtectedUneditableColumnNames } from "./getProtectedUneditableColumnNames"
import { areAllUneditableColumnsProtected } from "./areAllUneditableColumnsProtected"
import { convertColumnPositionToLetter } from "./convertColumnPositionToLetter"

export function toggleProtectUneditableColumns(_sheet: GoogleAppsScript.Spreadsheet.Sheet): boolean {

  const sheet = (typeof _sheet !== "undefined")
    ? _sheet
    : getSheetForSyncing()

  if (sheet !== null){
    if (areAllUneditableColumnsProtected() === false){
      const protectedColumns = getProtectedUneditableColumnNames()

      const notYetProtectedColumnPositions = getUneditableColumnNames()
        .filter((name): boolean => {
          return protectedColumns.indexOf(name) === -1
        })
        .map((name): number => {
          return getColumnPositionByName(name)
        })

      notYetProtectedColumnPositions
        .sort(function(a, b){return a - b})
        // Group adjacent columns together
        .reduce((groups: number[][], current) => {
          const lastGroup = groups[groups.length - 1]
          if (typeof lastGroup === "undefined"){
            groups.push([ current ])
          }
          else {
            const lastPositionInGroup = lastGroup[lastGroup.length - 1]
            if (lastPositionInGroup === current - 1){
              lastGroup.push(current)
            }
            else {
              groups.push([ current ])
            }
          }

          return groups
        }, [])
        .forEach((group): void => {
          const fromIndex = group[0]
          const toIndex = group[group.length - 1]

          sheet.getRange(
            `${convertColumnPositionToLetter(fromIndex)}:${convertColumnPositionToLetter(toIndex)}`
          ).protect().setDescription("Protected uneditable column").setWarningOnly(true)
        })

      return true
    }
    else {
      const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);

      protections
        .filter((protection): boolean => {
          return protection.getDescription() === "Protected uneditable column"
        })
        .forEach((protection): void => {
          protection.remove()
        })

      return false
    }
  }
  else {
    throw new Error("Document has not yet set up for syncing.")
  }
}
