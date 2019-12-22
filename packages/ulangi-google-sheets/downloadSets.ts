/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { findMaxLastSyncedAt } from "./findMaxLastSyncedAt"
import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"

export function downloadSets(){
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()

  let done = false
  let startAt = undefined
  const limit = 30
  const allSets = []

  while(done === false){
    const response = UrlFetchApp.fetch(apiUrl + `/download-sets?softLimit=${limit}&${typeof startAt !== "undefined" ? "startAt=" + startAt : ""}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + apiKey
      }
    })

    const result = JSON.parse(response.getContentText())
    startAt = findMaxLastSyncedAt(result.setList)
    allSets.push(...result.setList)

    done = result.noMore
  }

  return allSets
}
