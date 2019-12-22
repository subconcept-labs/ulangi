/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { getProtectedUneditableColumnNames } from "./getProtectedUneditableColumnNames"
import { getUneditableColumnNames } from "./getUneditableColumnNames"

export function areAllUneditableColumnsProtected(_sheet?: GoogleAppsScript.Spreadsheet.Sheet): boolean {

  const sheet = (typeof _sheet !== "undefined")
    ? _sheet
    : getSheetForSyncing()

  if (sheet !== null){
    return getProtectedUneditableColumnNames().length === getUneditableColumnNames().length
  }
  else {
    throw new Error("Document has not yet set up for syncing.")
  }
}
