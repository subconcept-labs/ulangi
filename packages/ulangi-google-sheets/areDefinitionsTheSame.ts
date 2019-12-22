/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

export function areDefinitionsTheSame(definitionOne: string, definitionTwo: string): boolean {
  return definitionOne
    .split("\n---\n")
    .filter((meaning): boolean => meaning.trim() !== "")
    .join("\n---\n")
  === definitionTwo
    .split("\n---\n")
    .filter((meaning): boolean => meaning.trim() !== "")
    .join("\n---\n")
}
