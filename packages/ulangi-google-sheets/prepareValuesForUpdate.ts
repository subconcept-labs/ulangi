/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial, DeepMutable } from '@ulangi/extended-types'
import { Vocabulary, Definition } from "@ulangi/ulangi-common/interfaces"
import { DefinitionStatus } from '@ulangi/ulangi-common/enums'

export function prepareValuesForUpdate(valueByName: {[P in string]: any }): [ DeepPartial<Vocabulary>, undefined | string] {

  const vocabulary: DeepPartial<DeepMutable<Vocabulary>> = {
    vocabularyId: valueByName.vocabularyId,
    updatedAt: new Date()
  }

  if (valueByName.vocabularyText !== valueByName.originalVocabularyText){
    vocabulary.vocabularyText = valueByName.vocabularyText
  }

  if (valueByName.vocabularyStatus !== valueByName.originalVocabularyStatus){
    vocabulary.vocabularyStatus = valueByName.vocabularyStatus
    vocabulary.updatedStatusAt = new Date()
  }

  if (valueByName.definitions !== valueByName.originalDefinitions){
    const currentMeanings: string[] = valueByName.definitions.split("\n---\n");
    const originalMeanings: string[] = valueByName.originalDefinitions.split("\n---\n");
    const originalDefinitionIds: string[] = valueByName.originalDefinitionIds.split("\n---\n");

    vocabulary.definitions = []

    for(let i = 0; i < currentMeanings.length || i < originalMeanings.length; i++) {
      if (typeof currentMeanings[i] !== 'undefined') {
        if (typeof originalDefinitionIds[i] === 'undefined' || originalDefinitionIds[i].trim() === "") {
          vocabulary.definitions.push({
            definitionId: Utilities.getUuid(),
            definitionStatus: "ACTIVE" as DefinitionStatus,
            source: "user",
            meaning: currentMeanings[i].trim(),
            wordClasses: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedStatusAt: new Date(),
            firstSyncedAt: null,
            lastSyncedAt: null,
            extraData: []
          })
        }
        else {
          vocabulary.definitions.push({
            definitionId: originalDefinitionIds[i],
            meaning: currentMeanings[i].trim(),
            updatedAt: new Date(),
          })
        }
      } 
      else if (typeof currentMeanings[i] === "undefined" && typeof originalDefinitionIds !== 'undefined') {
        vocabulary.definitions.push({
          definitionId: originalDefinitionIds[i],
          definitionStatus: "DELETED" as DefinitionStatus,
          updatedAt: new Date(),
          updatedStatusAt: new Date()
        })
      }
    }
  }

  if (valueByName.category !== valueByName.originalCategory){
    vocabulary.category = typeof vocabulary.category !== "undefined" ? vocabulary.category : {}
    vocabulary.category.categoryName = valueByName.category
    vocabulary.category.createdAt = new Date()
    vocabulary.category.updatedAt = new Date()
  }

  if (valueByName.spacedRepetitionLevel !== valueByName.originalSpacedRepetitionLevel){
    vocabulary.level = valueByName.spacedRepetitionLevel
  }

  if (valueByName.writingLevel !== valueByName.originalWritingLevel){
    vocabulary.writing = typeof vocabulary.writing !== "undefined" ? vocabulary.writing : {}
    vocabulary.writing.level = valueByName.writingLevel
    vocabulary.writing.createdAt = new Date()
    vocabulary.writing.updatedAt = new Date()
  }

  if (valueByName.disableWriting !== valueByName.originalDisableWriting){
    vocabulary.writing = typeof vocabulary.writing !== "undefined" ? vocabulary.writing : {}
    vocabulary.writing.disabled = valueByName.disableWriting
    vocabulary.writing.createdAt = new Date()
    vocabulary.writing.updatedAt = new Date()
  }

  let setId: undefined | string = undefined
  if (valueByName.setId !== valueByName.originalSetId){
    setId = valueByName.setId
  }

  return [ vocabulary, setId ]
}
