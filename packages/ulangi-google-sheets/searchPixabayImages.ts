/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"
import { queryStringify } from "./queryStringify"

export function searchPixabayImages(term: string, page: number): string[] {
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()

  const response = UrlFetchApp.fetch(apiUrl + '/search-pixabay-images?' + queryStringify({
    q: term,
    image_type: "all",
    page: page.toString(),
    safesearch: "true"
  }),
  {
    method: "get",
    headers: {
      Authorization: "Bearer " + apiKey
    },
    muteHttpExceptions: true
  })

  if (response.getResponseCode() === 200) {
    const hits = JSON.parse(response.getContentText()).hits

    return hits.map((hit: any): string => {
      return JSON.stringify(hit)
    })
  }
  else if (response.getResponseCode() === 401) {
    throw new Error("The API key is invalid or expired.")
  }
  else {
    throw new Error(response.getContentText())
  }
}
