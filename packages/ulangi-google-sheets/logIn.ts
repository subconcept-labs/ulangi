/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getApiUrl } from "./getApiUrl"
import { setApiKey } from "./setApiKey"
import { setUlangiEmail } from "./setUlangiEmail"

export function logIn(email: string, password: string): string {

  const apiUrl = getApiUrl()

  const response = UrlFetchApp.fetch(apiUrl + `/sign-in`, {
    method: "post",
    contentType: 'application/json',
    payload: JSON.stringify({
      email,
      password
    }),
    muteHttpExceptions: true
  })

  if (response.getResponseCode() === 200) {
    const result = JSON.parse(response.getContentText())
    const { accessToken, currentUser } = result
    setApiKey(accessToken)
    setUlangiEmail(currentUser.email)
    return currentUser.email

  } else {
    throw new Error("Invalid email or password.")
  }
}
