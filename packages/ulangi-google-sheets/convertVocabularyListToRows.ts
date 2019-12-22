/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getColumnPositionByName } from "./getColumnPositionByName"
import { getColumnNames } from "./getColumnNames"
import { getCurrentValueByColumnName } from "./getCurrentValueByColumnName"
import { getDefaultValues } from "./getDefaultValues"
import { convertVocabularyToOriginalValues } from "./convertVocabularyToOriginalValues"
import { convertVocabularyToEditableValues } from "./convertVocabularyToEditableValues"
import { escapeRegExp } from "./escapeRegExp"
import { Vocabulary } from "@ulangi/ulangi-common/interfaces"
import { DeepPartial } from "@ulangi/extended-types"

export function convertVocabularyListToRows(
  vocabularySetIdPairs: readonly [ DeepPartial<Vocabulary>, string | undefined][],
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): readonly [ undefined | number, any[] ][] {
  const columnNames = getColumnNames()
  const lastRow = sheet.getLastRow()

  const matches = sheet
    .getRange(
      1,
      getColumnPositionByName("vocabularyId"),
      lastRow
    )
    .createTextFinder(vocabularySetIdPairs.map(([vocabulary]) => `^${escapeRegExp(vocabulary.vocabularyId as string)}$`).join("|"))
    .useRegularExpression(true)
    .findAll()

  const vocabularyIdRowPairs = matches
    .map((match): [ string, number ] => {
      return [ match.getValue(), match.getRowIndex() ]
    })

  const vocabularyIdRowMap: {[P in string]: number} = vocabularyIdRowPairs
    .reduce(function(acc: {[P in string]: number}, current) {
      const [ vocabularyId, rowIndex ] = current;
      acc[vocabularyId] = rowIndex;
      return acc;
    }, {});

  const vocabularyIdCurrentValueMap: {[P in string]: {[P in string]: any}} = vocabularyIdRowPairs
    .map(([, rowIndex]): [ string, {[P in string]: any} ] => {
      const currentValueByColumnName = getCurrentValueByColumnName(
        sheet.getRange(rowIndex, 1, 1, columnNames.length).getValues()[0]
      )
      return [ currentValueByColumnName.vocabularyId, currentValueByColumnName ]
    })
    .reduce(function(acc: {[P in string]: {[P in string]: any}}, current) {
      const [ vocabularyId, currentValueByColumnName ] = current;
      acc[vocabularyId] = currentValueByColumnName;
      return acc;
    }, {});

  const rowIndexValuesPairs: [ number | undefined, any[]][] = vocabularySetIdPairs
    .map(([ vocabulary, setId ]) => {

      const newOriginalValues = convertVocabularyToOriginalValues(vocabulary, setId)
      const oldOriginalValues = vocabularyIdCurrentValueMap[newOriginalValues.vocabularyId]
      const defaultValues = getDefaultValues()

      for (const property in newOriginalValues) {
        // Use old original value if new original value is undefined
        if (newOriginalValues.hasOwnProperty(property) && typeof newOriginalValues[property] === "undefined") {
          if (typeof oldOriginalValues !== "undefined" && oldOriginalValues[property] !== ""){
            newOriginalValues[property] = oldOriginalValues[property]
          }
          else {
            newOriginalValues[property] = defaultValues[property]
          }
        }
      }

      return newOriginalValues
    })
    .map((originalValue) => {
      const rowIndex = vocabularyIdRowMap[originalValue.vocabularyId]
      const currentValue = vocabularyIdCurrentValueMap[originalValue.vocabularyId]

      const editableValue = convertVocabularyToEditableValues(originalValue, currentValue)

      const valueByColumnName: {[P in string]: any} = {
        ...editableValue,
        ...originalValue,
        edited: ""
      }

      const values = columnNames.map((columnName): string => {
        return valueByColumnName[columnName]
      })

      return [ rowIndex, values ]
    })

  return rowIndexValuesPairs
}
