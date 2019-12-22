/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Vocabulary } from "@ulangi/ulangi-common/interfaces"
import { updateRows } from "./updateRows"
import { findMaxLastSyncedAt } from "./findMaxLastSyncedAt"
import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"
import { getSheetForSyncing } from "./getSheetForSyncing"
import { getLastSyncTime } from "./getLastSyncTime"
import { setLastSyncTime } from "./setLastSyncTime"
import { setSyncingAction } from "./setSyncingAction"
import { unsetSyncingAction } from "./unsetSyncingAction"
import { getSetIdForSyncing } from "./getSetIdForSyncing"
import { isPulling } from "./isPulling"
import { queryStringify } from "./queryStringify"

export function downloadVocabulary(){
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()
  const sheet = getSheetForSyncing()
  const setId = getSetIdForSyncing()

  if (sheet === null || setId === null) {
    SpreadsheetApp.getUi().alert("Please click \"Set up for syncing\" button to create a sheet for syncing first.")
  }
  else {
    let done = false
    let startAt = getLastSyncTime()
    const limit = 30

    setSyncingAction("pull")

    while(done === false && isPulling()){

      const response = UrlFetchApp.fetch(apiUrl + '/download-vocabulary?' + queryStringify({
        softLimit: limit.toString(),
        startAt: startAt !== null ? startAt : undefined,
        setId
      }), {
        method: "get",
        headers: {
          Authorization: "Bearer " + apiKey
        },
        muteHttpExceptions: true
      })

      if (response.getResponseCode() === 200) {
        const result = JSON.parse(response.getContentText())
        startAt = findMaxLastSyncedAt(result.vocabularyList)
        
        setLastSyncTime(startAt)
        updateRows(sheet, result.vocabularyList.map((vocabulary: Vocabulary) => [ vocabulary, setId ]))

        done = result.noMore
      }
      else if (response.getResponseCode() === 401) {
        throw new Error("The API key is invalid or expired.")
      }
      else {
        throw new Error(response.getContentText())
      }
    }

    unsetSyncingAction()
  }
}
