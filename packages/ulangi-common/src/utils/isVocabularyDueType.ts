/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { VocabularyDueType } from '../enums/VocabularyDueType';

export function isVocabularyDueType(value: any): value is VocabularyDueType {
  return _.includes(_.values(VocabularyDueType), value);
}
