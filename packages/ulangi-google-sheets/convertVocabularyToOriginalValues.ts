/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Vocabulary } from "@ulangi/ulangi-common/interfaces"
import { DeepPartial } from "@ulangi/extended-types"
import { unparseDefinition } from "./unparseDefinition"

export function convertVocabularyToOriginalValues(vocabulary: DeepPartial<Vocabulary>, setId: string | undefined): {[P in string]: any} {
  return {
    vocabularyId: vocabulary.vocabularyId,
    originalDefinitionIds: typeof vocabulary.definitions !== "undefined"
      ? vocabulary.definitions
        .filter((definition: any): boolean => definition.definitionStatus !== "DELETED")
        .map((definition: any): string => definition.definitionId).join("\n---\n")
      : undefined,
    originalVocabularyText: vocabulary.vocabularyText,
    originalVocabularyStatus: vocabulary.vocabularyStatus,
    originalDefinitions: typeof vocabulary.definitions !== "undefined"
      ? vocabulary.definitions
        .filter((definition: any): boolean => definition.definitionStatus !== "DELETED")
        .map((definition: any): string => unparseDefinition(definition)).join("\n---\n")
      : undefined,
    originalCategory: typeof vocabulary.category !== "undefined" && typeof vocabulary.category.categoryName !== "undefined"
      ? vocabulary.category.categoryName 
      : undefined,
    originalSpacedRepetitionLevel: vocabulary.level,
    originalWritingLevel: typeof vocabulary.writing !== "undefined" && typeof vocabulary.writing.level !== "undefined"
      ? vocabulary.writing.level 
      : undefined,
    originalDisableWriting: typeof vocabulary.writing !== "undefined" && typeof vocabulary.writing.disabled !== "undefined"
      ? vocabulary.writing.disabled
      : undefined,
    originalSetId: setId
  }
}
