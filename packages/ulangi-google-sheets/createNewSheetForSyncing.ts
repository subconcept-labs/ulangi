/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { initHeader } from "./initHeader"
import { setSheetIdForSyncing } from "./setSheetIdForSyncing"
import { setSetIdForSyncing } from "./setSetIdForSyncing"
import { setDocumentMajorVersion } from "./setDocumentMajorVersion"
import { setDocumentMinorVersion } from "./setDocumentMinorVersion"
import { unsetLastSyncTime } from "./unsetLastSyncTime"
import { parseSetNameWithId } from "./parseSetNameWithId"
import { highlightUneditableColumns } from "./highlightUneditableColumns"
import { hideOriginalColumns } from "./hideOriginalColumns"
import { toggleHighlightEditedCells } from "./toggleHighlightEditedCells"
import { toggleProtectUneditableColumns } from "./toggleProtectUneditableColumns"
import { isHighlightEditedCellsEnabled } from "./isHighlightEditedCellsEnabled"
import { areAllUneditableColumnsProtected } from "./areAllUneditableColumnsProtected"
import { enableDataValidations } from "./enableDataValidations"

export function createNewSheetForSyncing(formObject: any) {
  const setNameWithId = formObject.setNameWithId

  let sheet = SpreadsheetApp.getActiveSheet()

  if (sheet.getLastRow() !== 0 && sheet.getLastColumn() !== 0) {
    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
    sheet = spreadSheet.insertSheet(setNameWithId)
  }
  else {
    sheet.setName(setNameWithId)
  }

  const [ setName, setId ] = parseSetNameWithId(setNameWithId)

  setSheetIdForSyncing(sheet.getSheetId())
  setSetIdForSyncing(setId)
  unsetLastSyncTime()

  highlightUneditableColumns(sheet)
  hideOriginalColumns(sheet)

  initHeader(sheet);
  setDocumentMajorVersion(1);
  setDocumentMinorVersion(0);

  sheet.setFrozenRows(1);
  enableDataValidations(sheet);

  if (isHighlightEditedCellsEnabled() === false) {
    toggleHighlightEditedCells()
  }

  if (areAllUneditableColumnsProtected() === false){
    toggleProtectUneditableColumns(sheet)
  }

}
