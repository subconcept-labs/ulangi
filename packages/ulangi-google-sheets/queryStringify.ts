/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function queryStringify(obj: {[P in string]: undefined | string }): string {
  const queryStrings = []
  for (const property in obj) {
    if (obj.hasOwnProperty(property) && typeof obj[property] !== "undefined") {
      queryStrings.push(property + "=" + obj[property])
    }
  }

  return queryStrings.join("&")
}
