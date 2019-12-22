/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getOriginalColumnNames } from "./getOriginalColumnNames"
import { getColumnPositionByName } from "./getColumnPositionByName"
import { getSheetForSyncing } from "./getSheetForSyncing"

export function hideOriginalColumns(_sheet?: GoogleAppsScript.Spreadsheet.Sheet): void {
  const sheet = typeof _sheet === "undefined" ? getSheetForSyncing() : _sheet

  if (sheet !== null){
    getOriginalColumnNames().forEach((name): void => {
      const position = getColumnPositionByName(name)
      sheet.hideColumns(position)
    })
  }
}
