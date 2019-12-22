/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';

import { VocabularyStatus } from '../enums/VocabularyStatus';

export function isVocabularyStatus(value: any): value is VocabularyStatus {
  return _.includes(_.values(VocabularyStatus), value);
}
