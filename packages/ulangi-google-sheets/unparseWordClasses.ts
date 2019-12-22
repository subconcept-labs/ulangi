/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { WordClass } from "@ulangi/ulangi-common/enums"

export function unparseWordClasses(wordClasses: WordClass[]): string {
  const mapping = {
    'NOUN': 'n',
    'VERB': 'v',
    'ADJECTIVE': 'adj',
    'ADVERB': 'adv',
    'PREPOSITION': 'prep',
    'PHRASAL_VERB': 'phrv',
    'IDIOM':'idm',
    'PRONOUN': 'pron'
  }

  return wordClasses.map((wordClass): string => {
    return '[' + mapping[wordClass] + ']'
  }).join(" ")
}
