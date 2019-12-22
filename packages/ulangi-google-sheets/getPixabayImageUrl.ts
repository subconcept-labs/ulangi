/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { getApiUrl } from "./getApiUrl"
import { getApiKey } from "./getApiKey"
import { queryStringify } from "./queryStringify"

export function getPixabayImageUrl(image: string): string {
  return JSON.parse(image).previewURL
}
