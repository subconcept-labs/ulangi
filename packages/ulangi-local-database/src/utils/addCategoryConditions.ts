/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as _ from 'lodash';
import * as squel from 'squel';

import { TableName } from '../enums/TableName';

export function addCategoryConditions(
  existingQuery: squel.Select,
  selectedCategoryNames: undefined | string[],
  excludedCategoryNames: undefined | string[]
): squel.Select {
  let buildingQuery = existingQuery.left_join(
    TableName.VOCABULARY_CATEGORY,
    'c',
    'c.vocabularyId = v.vocabularyId'
  );

  if (typeof selectedCategoryNames !== 'undefined') {
    if (_.includes(selectedCategoryNames, 'Uncategorized')) {
      buildingQuery = buildingQuery.where(
        'c.categoryName IN ? OR c.categoryName IS NULL',
        selectedCategoryNames
      );
    } else {
      buildingQuery = buildingQuery.where(
        'c.categoryName IN ?',
        selectedCategoryNames
      );
    }
  }

  if (typeof excludedCategoryNames !== 'undefined') {
    if (_.includes(excludedCategoryNames, 'Uncategorized')) {
      buildingQuery = buildingQuery.where(
        'c.categoryName NOT IN ? AND c.categoryName IS NOT NULL',
        excludedCategoryNames
      );
    } else {
      // Note: even though NULL is NOT IN excludedCategoryNames,
      // IS NULL check still is required
      buildingQuery = buildingQuery.where(
        'c.categoryName NOT IN ? OR c.categoryName IS NULL',
        excludedCategoryNames
      );
    }
  }

  return buildingQuery;
}
