/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Definition } from "@ulangi/ulangi-common/interfaces"
import { unparseWordClasses } from "./unparseWordClasses"
import { DeepPartial } from "@ulangi/extended-types"

export function unparseDefinition(definition: DeepPartial<Definition>): string {
  if (typeof definition.wordClasses !== "undefined" && definition.wordClasses.length > 0){
    return unparseWordClasses(definition.wordClasses.slice()) + ' ' + definition.meaning
  }
  else {
    return typeof definition.meaning !== "undefined" ? definition.meaning : ""
  }
}
