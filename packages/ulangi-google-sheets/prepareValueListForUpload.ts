/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { Vocabulary, Definition } from "@ulangi/ulangi-common/interfaces"
import { DefinitionStatus } from '@ulangi/ulangi-common/enums'
import { DeepPartial, DeepMutable } from '@ulangi/extended-types'
import { getCurrentValueByColumnName } from "./getCurrentValueByColumnName"
import { prepareValuesForUpdate } from "./prepareValuesForUpdate"
import { prepareValuesForInsert } from "./prepareValuesForInsert"

export function prepareValueListForUpload(valueList: any[][]): [ DeepPartial<Vocabulary>, undefined | string ][] {
  return valueList.map((values): [ DeepPartial<Vocabulary>, undefined | string ] => {
    const valueByName = getCurrentValueByColumnName(values)

    if (valueByName.edited === "NEW"){
      return prepareValuesForInsert(valueByName)
    }
    else {
      return prepareValuesForUpdate(valueByName)
    }
  })
}
