/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function getSheetById(sheetId: number): GoogleAppsScript.Spreadsheet.Sheet | null {
  return SpreadsheetApp.getActive().getSheets().filter(
    function(s) {
      return s.getSheetId() === sheetId
    }
  )[0] || null;
}
