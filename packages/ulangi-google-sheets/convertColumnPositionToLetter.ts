/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function convertColumnPositionToLetter(position: number): string {
  let temp, letter = '';

  while (position > 0)
  {
    temp = (position - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    position = (position - temp - 1) / 26;
  }
  return letter;
}
