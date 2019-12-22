/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { DeepPartial } from '@ulangi/extended-types';
import { SetExtraDataItemResolver } from '@ulangi/ulangi-common/resolvers';
import { SetExtraDataItem } from '@ulangi/ulangi-common/types';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SetExtraDataRow } from '../interfaces/SetExtraDataRow';

export class SetExtraDataRowConverter {
  private setExtraDataItemResolver = new SetExtraDataItemResolver();

  public convertToSetExtraDataItems(
    rows: readonly SetExtraDataRow[],
    stripUnknown: boolean
  ): readonly SetExtraDataItem[] {
    return this.setExtraDataItemResolver.resolveArray(
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

  public convertToPartialSetExtraDataItems(
    rows: readonly DeepPartial<SetExtraDataRow>[],
    stripUnknown: boolean
  ): readonly DeepPartial<SetExtraDataItem>[] {
    return this.setExtraDataItemResolver.resolvePartialArray(
      rows.map(
        (row): DeepPartial<SetExtraDataItem> => {
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
