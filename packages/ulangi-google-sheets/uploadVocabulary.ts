/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */
import { DeepPartial } from "@ulangi/extended-types";
import { Vocabulary } from "@ulangi/ulangi-common/interfaces";

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

    const lastRow = sheet.getLastRow()
    const editedRows = getEditedRows(1, lastRow, sheet)

    const vocabularySetIdPairs = prepareValueListForUpload(editedRows.map((row) => row.getValues()[0]))

    while(vocabularySetIdPairs.length > 0 && isPushing()){
      const chunk = vocabularySetIdPairs.splice(0, 10)
      
      const response = UrlFetchApp.fetch(apiUrl + `/upload-vocabulary`, {
        method: "post",
        contentType: 'application/json',
        payload: JSON.stringify({
          vocabularyList: chunk.map(([ vocabulary ]) => vocabulary),
          vocabularySetIdPairs: chunk
            .filter(([, setId]): boolean => typeof setId !== "undefined")
            .map(([ vocabulary, setId ]) => [ vocabulary.vocabularyId, setId ]),
        }),
        headers: {
          Authorization: "Bearer " + apiKey
        },
        muteHttpExceptions: true
      })

      if (response.getResponseCode() === 200) {
        const result = JSON.parse(response.getContentText())
        const acknowledgedIds = result.acknowledged
        
        updateRows(
          sheet,
          chunk.filter(([vocabulary]): boolean => {
            return acknowledgedIds.indexOf(vocabulary.vocabularyId) !== -1
          })
        )
      } else if (response.getResponseCode() === 401) {
        throw new Error("The API key is invalid or expired.")
      }
      else {
        throw new Error(response.getContentText())
      }
    }

    unsetSyncingAction()
  }

}
