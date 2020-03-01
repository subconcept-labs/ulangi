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
    vocabulary.category = {
      categoryName: valueByName.category,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  if (valueByName.spacedRepetitionLevel !== valueByName.originalSpacedRepetitionLevel){
    vocabulary.level = valueByName.spacedRepetitionLevel
  }

  if (valueByName.writingLevel !== valueByName.originalWritingLevel
    || valueByName.disableWriting !== valueByName.originalDisableWriting
  ){
    vocabulary.writing = {}
    vocabulary.writing.createdAt = new Date()
    vocabulary.writing.updatedAt = new Date()

    if (valueByName.writingLevel !== valueByName.originalWritingLevel) {
      vocabulary.writing.level = valueByName.writingLevel
    }

    if (valueByName.disableWriting !== valueByName.originalDisableWriting){
      vocabulary.writing.disabled = valueByName.disableWriting
    }
  }

  let setId: undefined | string = undefined

  if (valueByName.setId !== valueByName.originalSetId){
    setId = valueByName.setId
  }

  if (vocabulary.vocabularyText === "") {
    throw `Empty vocabularyText is not allowed (please check the row with ${vocabulary.vocabularyId})`
  }

  if (typeof vocabulary.category !== "undefined") {
      if (vocabulary.category.categoryName === "") {
      throw `Empty category is not allowed (please check the row with vocabularyId ${vocabulary.vocabularyId})`
    }
  }

  if (typeof vocabulary.definitions !== 'undefined'){
    if (
      vocabulary.definitions.length === 0 ||
      vocabulary.definitions.filter((definition): boolean => definition.meaning === '').length > 0
    ) {
      throw `Empty definition is not allowed (please check the row with vocabularyId ${vocabulary.vocabularyId})`
    }
  } 

  if (setId === "") {
    throw `Empty setId is not allowed (please check the row with vocabularyId ${vocabulary.vocabularyId})`
  }

  return [ vocabulary, setId ]
}
