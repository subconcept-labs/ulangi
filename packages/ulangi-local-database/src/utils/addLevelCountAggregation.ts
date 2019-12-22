/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import * as squel from 'squel';

export function addLevelCountAggregation(
  existingQuery: squel.Select
): squel.Select {
  let buildingQuery = existingQuery
    .field(
      'COALESCE(SUM(CASE WHEN v.level = 0 THEN 1 else 0 END), 0)',
      'srLevel0Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN v.level >= 1 AND v.level <= 3 THEN 1 else 0 END), 0)',
      'srLevel1To3Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN v.level >= 4 AND v.level <= 6 THEN 1 else 0 END), 0)',
      'srLevel4To6Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN v.level >= 7 AND v.level <= 8 THEN 1 else 0 END), 0)',
      'srLevel7To8Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN v.level >= 9 AND v.level <= 10 THEN 1 else 0 END), 0)',
      'srLevel9To10Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN w.level IS NULL OR w.level = 0 THEN 1 else 0 END), 0)',
      'wrLevel0Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN w.level >= 1 AND v.level <= 3 THEN 1 else 0 END), 0)',
      'wrLevel1To3Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN w.level >= 4 AND v.level <= 6 THEN 1 else 0 END), 0)',
      'wrLevel4To6Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN w.level >= 7 AND v.level <= 8 THEN 1 else 0 END), 0)',
      'wrLevel7To8Count'
    )
    .field(
      'COALESCE(SUM(CASE WHEN w.level >= 9 AND v.level <= 10 THEN 1 else 0 END), 0)',
      'wrLevel9To10Count'
    );

  return buildingQuery;
}
