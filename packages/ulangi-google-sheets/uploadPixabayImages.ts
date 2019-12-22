/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"
import { queryStringify } from "./queryStringify"

export function uploadPixabayImages(value: string | string[]): string {
  const apiUrl = getApiUrl()
  const apiKey = getApiKey()

  const images = typeof value === "string"
    ? [ JSON.parse(value) ]
    : value.map((v): string => JSON.parse(v))

  const response = UrlFetchApp.fetch(apiUrl + '/upload-pixabay-images',
  {
    method: "post",
    payload: {
      images: JSON.stringify(images)
    },
    headers: {
      Authorization: "Bearer " + apiKey
    },
    muteHttpExceptions: true
  })

  if (response.getResponseCode() === 200) {
    return JSON.parse(response.getContentText()).urls
  }
  else if (response.getResponseCode() === 401) {
    throw new Error("The API key is invalid or expired.")
  }
  else {
    throw new Error(response.getContentText())
  }
}
