/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { isHighlightEditedCellsEnabled } from "./isHighlightEditedCellsEnabled"
import { createHighlightEditedCellsRule } from "./createHighlightEditedCellsRule"

export function toggleHighlightEditedCells(): boolean {
  const sheet = getSheetForSyncing()

  if (sheet !== null){
    if (isHighlightEditedCellsEnabled() === false){
      const rules = sheet.getConditionalFormatRules();
      rules.push(createHighlightEditedCellsRule());
      sheet.setConditionalFormatRules(rules);
      return true
    }
    else {
      const rules = sheet.getConditionalFormatRules();
      const ruleToRemove = createHighlightEditedCellsRule()
      const newRules = rules.filter((currentRule): boolean => {
        return currentRule.getBooleanCondition().getCriteriaValues()[0] !== ruleToRemove.getBooleanCondition().getCriteriaValues()[0]
      })
      sheet.setConditionalFormatRules(newRules);
      return false
    }
  }
  else {
    throw new Error("Document has not yet set up for syncing.")
  }
}
