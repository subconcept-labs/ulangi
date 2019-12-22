/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getSheetForSyncing } from "./getSheetForSyncing"
import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"
import { getEditedRows } from "./getEditedRows"
import { setSyncingAction } from "./setSyncingAction"
import { unsetSyncingAction } from "./unsetSyncingAction"
import { prepareValueListForUpload } from "./prepareValueListForUpload"
import { updateRows } from "./updateRows"
import { isPushing } from "./isPushing"

export function uploadVocabulary(): void {
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()

  const sheet = getSheetForSyncing()

  if (sheet === null) {
    SpreadsheetApp.getUi().alert("Please click \"Set up for syncing\" button to create a sheet for syncing first.")
  }
  else {
    setSyncingAction("push")

    let fromIndex = 1
    let done = false
    const lastRow = sheet.getLastRow()
    while(done === false && fromIndex <= lastRow && isPushing()){
      const editedRows = getEditedRows(fromIndex, lastRow, 30, sheet)

      if (editedRows.length > 0){
        const vocabularySetIdPairs = prepareValueListForUpload(editedRows.map((row) => row.getValues()[0]))

        const response = UrlFetchApp.fetch(apiUrl + `/upload-vocabulary`, {
          method: "post",
          contentType: 'application/json',
          payload: JSON.stringify({
            vocabularyList: vocabularySetIdPairs.map(([ vocabulary ]) => vocabulary),
            vocabularySetIdPairs: vocabularySetIdPairs
              .filter(([, setId]): boolean => typeof setId !== "undefined")
              .map(([ vocabulary, setId ]) => [ vocabulary.vocabularyId, setId ]),
            vocabularyFieldSchemas: [],
            definitionFieldSchemas: []
          }),
          headers: {
            Authorization: "Bearer " + apiKey
          },
          muteHttpExceptions: true
        })

        if (response.getResponseCode() === 200) {
          const result = JSON.parse(response.getContentText())
          const vocabularyIds = result.acknowledged
          
          updateRows(
            sheet,
            vocabularySetIdPairs.filter(([vocabulary]): boolean => {
              return vocabularyIds.indexOf(vocabulary.vocabularyId) !== -1
            })
          )

          fromIndex = editedRows[editedRows.length - 1].getRowIndex() + 1
        } else if (response.getResponseCode() === 401) {
          throw new Error("The API key is invalid or expired.")
        }
        else {
          throw new Error(response.getContentText())
        }
      }
      else {
        done = true
      }
    }

    unsetSyncingAction()
  }

}
