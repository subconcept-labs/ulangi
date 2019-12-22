/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"

export function showSettingsDialog() {
  if (getSheetForSyncing() === null ){
    SpreadsheetApp.getUi().alert("Please click \"Set up for syncing\" button on sidebar to create a sheet for syncing first.")
  }
  else {
    const html = HtmlService.createHtmlOutputFromFile('settings.html')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

    SpreadsheetApp.getUi().showModalDialog(html, 'Settings');
  }
}
