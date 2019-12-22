/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

// Similar to String.prototype.matchAll()
export function matchAll(str: string, reg: RegExp): RegExpExecArray[] {
  const regexp = RegExp(reg);

  const matches: RegExpExecArray[] = [];

  let match;
  do {
    match = regexp.exec(str);
    if (match !== null) {
      matches.push(match);
    }
  } while (match !== null);

  return matches;
}
