/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSetIdForSyncing } from "./getSetIdForSyncing"

export function getDefaultValues(): {[P in string]: any} {
  const setId = getSetIdForSyncing()
  return {
    vocabularyId: Utilities.getUuid(),
    originalDefinitionIds: "",
    originalVocabularyText: "",
    originalVocabularyStatus: "ACTIVE",
    originalDefinitions: "",
    originalCategory: "Uncategorized",
    originalSpacedRepetitionLevel: 0,
    originalWritingLevel: 0,
    originalDisableWriting: false,
    originalSetId: setId,
    vocabularyText: "",
    vocabularyStatus: "ACTIVE",
    definitions: "",
    category: "Uncategorized",
    spacedRepetitionLevel: 0,
    writingLevel: 0,
    disableWriting: false,
    setId,
    edited: "NEW"
  }
}
