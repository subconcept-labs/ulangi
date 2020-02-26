/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnNames } from "./getColumnNames"
import { getCurrentValueByColumnName } from "./getCurrentValueByColumnName"
import { areDefinitionsTheSame } from "./areDefinitionsTheSame"

export function isEdited(valueList: any[][]): string {
  if (valueList.length > 1) {
    throw new Error("ISEDITED only accepts a single-row range.")
  }
  else {
    const values = valueList[0]

    const valueByName = getCurrentValueByColumnName(values)

    if (valueByName.vocabularyText !== valueByName.originalVocabularyText
      || (valueByName.vocabularyStatus !== valueByName.originalVocabularyStatus)
      || (!areDefinitionsTheSame(valueByName.definitions, valueByName.originalDefinitions))
      || (valueByName.category !== valueByName.originalCategory)
      || (valueByName.spacedRepetitionLevel !== valueByName.originalSpacedRepetitionLevel)
      || (valueByName.writingLevel !== valueByName.originalWritingLevel)
      || (valueByName.disableWriting !== valueByName.originalDisableWriting)
      || (valueByName.setId !== valueByName.originalSetId)
    ){
      return "YES"
    }
    else {
      return "NO"
    }
  }
}
