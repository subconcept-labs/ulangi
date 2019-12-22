/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { renderMenu } from "./renderMenu"
import { unsetSyncingAction } from "./unsetSyncingAction"
import { setApiUrl } from "./setApiUrl"
import { getColumnNames } from "./getColumnNames"
import { getColumnPositionByName } from "./getColumnPositionByName"
import { getDefaultValues } from "./getDefaultValues"
import { getSheetIdForSyncing } from "./getSheetIdForSyncing"
import { fillWithDefaultValues } from "./fillWithDefaultValues"
import { emptyOriginalValues } from "./emptyOriginalValues"

function onInstall(e: GoogleAppsScript.Events.AddonOnInstall) {
  renderMenu()
  setApiUrl()
}

function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen) {
  renderMenu()

  if (e && e.authMode !== ScriptApp.AuthMode.NONE) {
    unsetSyncingAction()
  }
}

function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit){
  const columnNames = getColumnNames()

  const columnIndex = e.range.getColumn()
  const fromIndex = e.range.getRowIndex()
  const numOfRows = e.range.getNumRows()
  const sheet = e.range.getSheet()

  if (columnIndex <= columnNames.length && sheet.getSheetId() === getSheetIdForSyncing()) {
    const rowIndices: number[] = Array.apply(null, Array(numOfRows)).map((_, index): number => fromIndex + index)

    const rowIndexValuesPairs = rowIndices
      .map((rowIndex): [ number, any[] ] => {
        return [
          rowIndex,
          sheet.getRange(
            rowIndex,
            1,
            1,
            columnNames.length
          ).getValues()[0]
        ]
      })
      .filter(([, values]): boolean => {
        return values.filter((value) => value !== "").length >  0
      })
      .filter(([, values]): boolean => {
        return values[getColumnPositionByName("vocabularyId") - 1] === ""
          || values[getColumnPositionByName("edited") - 1]  === ""
      })
      .map(([rowIndex, values]): [ number, any[] ] => {
        return [
          rowIndex,
          fillWithDefaultValues(values)
        ]
      })
      .map(([rowIndex, values]): [ number, any[] ] => {
        // Make origina values empty for new row
        return [
          rowIndex,
          emptyOriginalValues(values)
        ]
      })

    rowIndexValuesPairs.forEach(([rowIndex, values]): void => {
      sheet.getRange(
        rowIndex,
        1,
        1,
        columnNames.length
      ).setValues([ values ])
    })
  }
}
