/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { createHighlightEditedCellsRule } from "./createHighlightEditedCellsRule"

export function isHighlightEditedCellsEnabled(): boolean {
  const sheet = getSheetForSyncing()

  if (sheet !== null){
    const rules = sheet.getConditionalFormatRules();
    const rule = createHighlightEditedCellsRule()

    return rules.filter((currentRule): boolean => {
      return currentRule.getBooleanCondition().getCriteriaValues()[0] === rule.getBooleanCondition().getCriteriaValues()[0]
    }).length > 0
  }
  else {
    throw new Error("Document has not yet set up for syncing.")
  }
}
