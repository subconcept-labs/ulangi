/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { areDefinitionsTheSame } from "./areDefinitionsTheSame"

export function convertVocabularyToEditableValues(originalValue: {[P in string]: any}, currentValue: undefined | {[P in string]: any }): {[P in string]: any} {
  if (typeof currentValue !== "undefined"){
    return {
      vocabularyText: currentValue.vocabularyText !== currentValue.originalVocabularyText 
        ? currentValue.vocabularyText
        : originalValue.originalVocabularyText, 
      vocabularyStatus: currentValue.vocabularyStatus !== currentValue.originalVocabularyStatus 
        ? currentValue.vocabularyStatus
        : originalValue.originalVocabularyStatus,
      definitions: areDefinitionsTheSame(currentValue.definitions,  currentValue.originalDefinitions) === false
        ? currentValue.definitions
        : originalValue.originalDefinitions,
      category: currentValue.category !== currentValue.originalCategory
        ? currentValue.category
        : originalValue.originalCategory,
      spacedRepetitionLevel: currentValue.spacedRepetitionLevel !== currentValue.originalSpacedRepetitionLevel
        ? currentValue.spacedRepetitionLevel
        : originalValue.originalSpacedRepetitionLevel,
      writingLevel: currentValue.writingLevel !== currentValue.originalWritingLevel
        ? currentValue.writingLevel
        : originalValue.originalWritingLevel,
      disableWriting: currentValue.disableWriting !== currentValue.originalDisableWriting
        ? currentValue.disableWriting
        : originalValue.originalDisableWriting,
      setId: currentValue.setId !== currentValue.originalSetId
        ? currentValue.setId
        : originalValue.originalSetId
    }
  }
  else {
    return {
      vocabularyText: originalValue.originalVocabularyText, 
      vocabularyStatus: originalValue.originalVocabularyStatus,
      definitions: originalValue.originalDefinitions,
      category: originalValue.originalCategory,
      spacedRepetitionLevel: originalValue.originalSpacedRepetitionLevel,
      writingLevel: originalValue.originalWritingLevel,
      disableWriting: originalValue.originalDisableWriting,
      setId: originalValue.originalSetId
    }
  }
}
