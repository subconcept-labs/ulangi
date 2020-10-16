/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { VocabularySortType } from '@ulangi/ulangi-common/enums';
import * as squel from 'squel';

export function addVocabularySorting(
  query: squel.Select,
  sortType: VocabularySortType
): squel.Select {
  if (sortType === VocabularySortType.SORT_BY_NAME_ASC) {
    query = query.order('v.vocabularyText', true);
  } else if (sortType === VocabularySortType.SORT_BY_NAME_DESC) {
    query = query.order('v.vocabularyText', false);
  } else if (sortType === VocabularySortType.SORT_BY_CREATION_TIME_ASC) {
    query = query.order('v.createdAt', true);
  } else if (sortType === VocabularySortType.SORT_BY_CREATION_TIME_DESC) {
    query = query.order('v.createdAt', false);
  } else if (sortType === VocabularySortType.SORT_BY_UPDATE_TIME_ASC) {
    query = query.order('v.updatedAt', true);
  } else if (sortType === VocabularySortType.SORT_BY_UPDATE_TIME_DESC) {
    query = query.order('v.updatedAt', false);
  } else if (sortType === VocabularySortType.RANDOM) {
    query = query.order('RANDOM()');
  }

  return query;
}
