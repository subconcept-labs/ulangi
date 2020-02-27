/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Vocabulary, Definition } from "@ulangi/ulangi-common/interfaces"
import { DefinitionStatus } from '@ulangi/ulangi-common/enums'

export function prepareValuesForInsert(valueByName: {[P in string]: any }): [ Vocabulary, string] {

  const vocabulary: Vocabulary = {
    vocabularyId: valueByName.vocabularyId,
    vocabularyText: valueByName.vocabularyText,
    vocabularyStatus: valueByName.vocabularyStatus,
    updatedAt: new Date(),
    updatedStatusAt: new Date(),
    createdAt: new Date(),
    firstSyncedAt: null,
    lastSyncedAt: null,
    definitions: valueByName.definitions.split("\n---\n")
      .filter((meaning: string): boolean => {
        return meaning.trim() !== ""
      })
      .map((meaning: string): Definition => {
        return {
          definitionId: Utilities.getUuid(),
          definitionStatus: "ACTIVE" as DefinitionStatus,
          source: "user",
          meaning: meaning.trim(),
          wordClasses: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedStatusAt: new Date(),
          firstSyncedAt: null,
          lastSyncedAt: null,
          extraData: []
        }
      }),
    category : {
      categoryName: valueByName.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstSyncedAt: null,
      lastSyncedAt: null,
    },
    level: valueByName.spacedRepetitionLevel,
    lastLearnedAt: null,
    writing: {
      level: valueByName.writingLevel,
      disabled: valueByName.disableWriting,
      lastWrittenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstSyncedAt: null,
      lastSyncedAt: null,
    },
    extraData: []
  }

  if (vocabulary.vocabularyText === "") {
    throw new Error(`vocabularyText cannot be empty. Please check the term with vocabularyId ${vocabulary.vocabularyId}.`)
  }

  if (typeof vocabulary.category !== "undefined") {
      if (vocabulary.category.categoryName === "") {
      throw new Error(`category cannot be empty. Please check the term with vocabularyId ${vocabulary.vocabularyId}.`)
    }
  }

  if (vocabulary.definitions.length === 0) {
    throw new Error(`definitions cannot be empty. Please check the term with vocabularyId ${vocabulary.vocabularyId}.`)
  }

  if (valueByName.setId === "") {
    throw new Error(`setId cannot be empty. Please check the term with vocabularyId ${vocabulary.vocabularyId}.`)
  }

  return [ vocabulary, valueByName.setId ]
}
