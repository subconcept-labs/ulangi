/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function parseSetNameWithId(setNameWithId: string): [ string, string ] {
  const init = setNameWithId.lastIndexOf('[');
  const fin = setNameWithId.lastIndexOf(']');
  return [
    setNameWithId.substr(0, init),
    setNameWithId.substr(init + 1, fin - init - 1)
  ] 
}
