/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as squel from 'squel';

export function addLearnedCondition(query: squel.Select): squel.Select {
  return query.where(
    'v.lastLearnedAt IS NOT NULL OR (w.lastWrittenAt IS NOT NULL AND w.disabled == 0)'
  );
}
