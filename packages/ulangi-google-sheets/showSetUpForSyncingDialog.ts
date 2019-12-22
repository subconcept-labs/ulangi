/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { getApiKey } from "./getApiKey"

export function showSetUpForSyncingDialog() {

  if (getApiKey() === null ){
    SpreadsheetApp.getUi().alert("Please set API key first.")
  }
  else {
    const hasSetUp = getSheetForSyncing() !== null

    if (hasSetUp){
      SpreadsheetApp.getUi().alert("You've set up a sheet for syncing. Please create another document if you want to set up for another set.")
    }
    else {
      const html = HtmlService.createHtmlOutputFromFile('set-up-for-syncing.html')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

      SpreadsheetApp.getUi().showModalDialog(html, 'Set up for syncing');
    }
  }
}
