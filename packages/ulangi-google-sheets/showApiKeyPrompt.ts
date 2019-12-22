/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { setApiKey } from "./setApiKey"

export function showApiKeyPrompt() {
  const ui = SpreadsheetApp.getUi(); // Same variations.

  const result = ui.prompt(
      'Set API key',
      'Please enter API key:',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  const button = result.getSelectedButton();
  const text = result.getResponseText();
  if (button == ui.Button.OK) {
    setApiKey(text)
  }
}
