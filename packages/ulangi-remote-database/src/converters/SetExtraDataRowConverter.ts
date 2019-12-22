/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { SetExtraDataItemResolver } from '@ulangi/ulangi-common/resolvers';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';

import { SetExtraDataRow } from '../interfaces/SetExtraDataRow';

export class SetExtraDataRowConverter {
  private setExtraDataItemResolver = new SetExtraDataItemResolver();

  public convertToSetExtraDataItems(
    rows: readonly SetExtraDataRow[],
    stripUnknown: boolean
  ): readonly SetExtraDataItem[] {
    return this.setExtraDataItemResolver.resolveArray(
      rows.map(
        (row): SetExtraDataItem => {
          return {
            dataName: row.dataName as any,
            dataValue: JSON.parse(row.dataValue),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            firstSyncedAt: row.firstSyncedAt,
            lastSyncedAt: row.lastSyncedAt,
          };
        }
      ),
      stripUnknown
    );
  }
}
