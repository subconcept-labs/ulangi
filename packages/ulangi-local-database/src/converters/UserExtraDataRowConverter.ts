/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { UserExtraDataItemResolver } from '@ulangi/ulangi-common/resolvers';
import { UserExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as moment from 'moment';

import { UserExtraDataRow } from '../interfaces/UserExtraDataRow';

export class UserExtraDataRowConverter {
  private userExtraDataItemResolver = new UserExtraDataItemResolver();

  public convertToUserExtraDataItems(
    rows: readonly UserExtraDataRow[],
    stripUnknown: boolean
  ): readonly UserExtraDataItem[] {
    return this.userExtraDataItemResolver.resolveArray(
      rows.map(
        (row): object => {
          return {
            dataName: row.dataName,
            dataValue: JSON.parse(row.dataValue),
            createdAt: moment.unix(row.createdAt).toDate(),
            updatedAt: moment.unix(row.updatedAt).toDate(),
            firstSyncedAt:
              row.firstSyncedAt !== null
                ? moment.unix(row.firstSyncedAt).toDate()
                : null,
            lastSyncedAt:
              row.lastSyncedAt !== null
                ? moment.unix(row.lastSyncedAt).toDate()
                : null,
          };
        }
      ),
      stripUnknown
    );
  }

  public convertToPartialUserExtraDataItems(
    rows: readonly DeepPartial<UserExtraDataRow>[],
    stripUnknown: boolean
  ): readonly DeepPartial<UserExtraDataItem>[] {
    return this.userExtraDataItemResolver.resolvePartialArray(
      rows.map(
        (row): DeepPartial<UserExtraDataItem> => {
          return _.omitBy(
            {
              dataName: row.dataName,
              dataValue:
                typeof row.dataValue !== 'undefined'
                  ? JSON.parse(row.dataValue)
                  : row.dataValue,
              createdAt:
                typeof row.createdAt !== 'undefined' && row.createdAt !== null
                  ? moment.unix(row.createdAt).toDate()
                  : row.createdAt,
              updatedAt:
                typeof row.updatedAt !== 'undefined' && row.updatedAt !== null
                  ? moment.unix(row.updatedAt).toDate()
                  : row.updatedAt,
              firstSyncedAt:
                typeof row.firstSyncedAt !== 'undefined' &&
                row.firstSyncedAt !== null
                  ? moment.unix(row.firstSyncedAt).toDate()
                  : row.firstSyncedAt,
              lastSyncedAt:
                typeof row.lastSyncedAt !== 'undefined' &&
                row.lastSyncedAt !== null
                  ? moment.unix(row.lastSyncedAt).toDate()
                  : row.lastSyncedAt,
            },
            _.isUndefined
          );
        }
      ),
      stripUnknown
    );
  }
}
