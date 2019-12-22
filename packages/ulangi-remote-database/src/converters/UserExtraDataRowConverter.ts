/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { UserExtraDataItemResolver } from '@ulangi/ulangi-common/resolvers';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';

import { UserExtraDataRow } from '../interfaces/UserExtraDataRow';

export class UserExtraDataRowConverter {
  private userExtraDataItemResolver = new UserExtraDataItemResolver();

  public convertToUserExtraDataItems(
    rows: readonly UserExtraDataRow[],
    stripUnknown: boolean
  ): readonly UserExtraDataItem[] {
    return this.userExtraDataItemResolver.resolveArray(
      rows.map(
        (row): UserExtraDataItem => {
          return {
            dataName: row.dataName,
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
